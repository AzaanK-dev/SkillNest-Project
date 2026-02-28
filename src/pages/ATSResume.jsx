import { useContext, useMemo } from "react";
import { GithubProfileContext } from "../contextAPI/GithubProfileContext";
import { ManualProfileContext } from "../contextAPI/ManualProfileContext";
import { ResumeContext } from "../contextAPI/ResumeContext";
import MotionBtn from "../components/MotionBtn";
import html2pdf from "html2pdf.js";

const ATSResume = () => {
  const { profile, skills, projects } = useContext(GithubProfileContext);
  const { data } = useContext(ManualProfileContext);
  const isGithub = profile && profile.name;

  const sourceProfile = isGithub ? profile : data;
  const sourceSkills = isGithub ? skills : data?.skills;
  const sourceProjects = isGithub ? projects : data?.projects;

  const initialData = {
    name: isGithub ? sourceProfile.name : sourceProfile?.fullName,
    title: isGithub ? "Software Developer" : sourceProfile?.title || "Software Developer",
    contact: {
      email: sourceProfile?.email || "",
      phone: sourceProfile?.phone || "",
      location: sourceProfile?.location || "",
      linkedin: sourceProfile?.linkedin || "",
      github: isGithub ? sourceProfile?.html_url : sourceProfile?.github,
    },
    summary: isGithub
      ? sourceProfile?.bio || "Developer with hands-on project experience."
      : sourceProfile?.summary,
    experience: isGithub
      ? sourceProjects.map(repo => ({
        company: "GitHub",
        title: repo.title,
        location: "Remote",
        dates: repo.updated_at?.slice(0, 4),
        bullets: [repo.description || "Open-source project hosted on GitHub"],
      }))
      : sourceProjects,
    education: [],
    skills: isGithub
      ? { Technologies: sourceSkills.map(skill => skill.name) }
      : sourceSkills,
    certifications: sourceProfile?.certifications || [],
  };

  const { formData } = useContext(ResumeContext);
  const resumeData = useMemo(() => {
    return {
      ...initialData,
      title: formData?.title || initialData.title,
      contact: {
        email: formData?.email || initialData.contact.email,
        phone: formData?.phone || initialData.contact.phone,
        location: formData?.location || initialData.contact.location,
        linkedin: formData?.linkedin || initialData.contact.linkedin,
        github: initialData.contact.github,
      },
      education: formData?.education?.length ? formData.education : initialData.education,
      certifications: formData?.certifications?.length ? formData.certifications : initialData.certifications,
    };
  }, [formData, initialData]);

  const handleDownload = () => {
    const element = document.getElementById("resume-pdf");
    html2pdf()
      .from(element)
      .set({
        margin: 0.5,
        filename: "ATS_Resume.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 min-h-screen py-5">
      <MotionBtn className="absolute right-4 sm:right-16 text-white" onClick={handleDownload}>Download PDF</MotionBtn>
      <div id="resume-pdf" className="relative max-w-[850px] mx-auto my-20 px-[70px] py-[60px] bg-white text-[#1a1a1a] leading-relaxed shadow-[0_4px_40px_rgba(0,0,0,0.12)] font-serif">
        {/* HEADER */}
        <div className="border-b-[2.5px] border-[#1a1a1a] pb-[18px] mb-[22px]">
          <h1 className="text-[32px] font-bold tracking-wide m-0 mb-1 text-[#0a0a0a]">{resumeData.name}</h1>
          <p className="text-[14px] italic text-[#444] mt-0 mb-[14px] tracking-[0.5px]">{resumeData.title}</p>
          <div className="flex flex-wrap gap-x-[22px] gap-y-[6px] text-[12.5px] text-[#333]">
            <span>{resumeData.contact.email}</span>
            <span>|</span>
            <span>{resumeData.contact.phone}</span>
            <span>|</span>
            <span>{resumeData.contact.location}</span>
            <span>|</span>
            <span>{resumeData.contact.linkedin}</span>
            <span>|</span>
            <span>{resumeData.contact.github}</span>
          </div>
        </div>
        {/* SUMMARY */}
        <div>
          <h2 className="text-[12px] font-bold tracking-[2.5px] uppercase text-[#0a0a0a] border-b-[1.5px] border-[#1a1a1a] pb-1 mt-[22px] mb-[14px]">
            Professional Summary
          </h2>
          <p className="text-[13.5px] text-[#222] leading-[1.7] m-0">{resumeData.summary}</p>
        </div>
        {/* EXPERIENCE */}
        <div>
          <h2 className="text-[12px] font-bold tracking-[2.5px] uppercase text-[#0a0a0a] border-b-[1.5px] border-[#1a1a1a] pb-1 mt-[22px] mb-[14px]">
            Work Experience / Projects
          </h2>
          {resumeData.experience.map((job, i) => (
            <div key={i} className="mb-[18px]">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className="text-[14px] font-bold text-[#0a0a0a] m-0">{job.title}</h3>
                <span className="text-[12.5px] text-[#555] whitespace-nowrap">{job.dates}</span>
              </div>
              <p className="text-[13px] text-[#444] italic m-0 mb-[7px]">
                {job.company} &mdash; {job.location}
              </p>
              <ul className="m-0 pl-[18px]">
                {job.bullets.map((b, j) => (
                  <li key={j} className="text-[13px] text-[#222] mb-1 leading-[1.6]">{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* EDUCATION */}
        <div>
          <h2 className="text-[12px] font-bold tracking-[2.5px] uppercase text-[#0a0a0a] border-b-[1.5px] border-[#1a1a1a] pb-1 mt-[22px] mb-[14px]">
            Education
          </h2>
          {resumeData.education.map((edu, i) => (
            <div key={i} className="flex justify-between items-start">
              <div>
                <p className="text-[14px] font-bold text-[#0a0a0a] m-0">{edu.degree}</p>
                <p className="text-[13px] text-[#444] italic my-0.5">{edu.school} &mdash; {edu.location}</p>
                <p className="text-[12.5px] text-[#555] m-0">{edu.note}</p>
              </div>
              <span className="text-[12.5px] text-[#555] whitespace-nowrap">{edu.dates}</span>
            </div>
          ))}
        </div>
        {/* SKILLS */}
        <div>
          <h2 className="text-[12px] font-bold tracking-[2.5px] uppercase text-[#0a0a0a] border-b-[1.5px] border-[#1a1a1a] pb-1 mt-[22px] mb-[14px]">
            Skills
          </h2>
          <div className="grid grid-cols-2 gap-x-[30px] gap-y-2">
            {Object.entries(resumeData.skills).map(([label, values], i) => (
              <div key={i} className="mb-1.5">
                <div className="text-[12px] font-bold text-[#0a0a0a] tracking-[0.5px]">{label}</div>
                <ul className="m-0 pl-[18px]">
                  {values.map((skill, idx) => (
                    <li key={idx} className="text-[13px] text-[#222] mb-1 leading-[1.6]">{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* CERTIFICATIONS */}
        {resumeData.certifications.length > 0 && (
          <div>
            <h2 className="text-[12px] font-bold tracking-[2.5px] uppercase text-[#0a0a0a] border-b-[1.5px] border-[#1a1a1a] pb-1 mt-[22px] mb-[14px]">
              Certifications
            </h2>
            {resumeData.certifications.map((cert, i) => (
              <p key={i} className="text-[13px] text-[#222] mb-1">
                &#9670; {cert.name} — {cert.institute}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ATSResume;