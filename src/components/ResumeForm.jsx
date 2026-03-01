import { useContext, useState } from "react";
import { ResumeContext } from "../contextAPI/ResumeContext";
import { useNavigate } from "react-router-dom";

const initialForm = {
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  education: [{ school: "", from: "", to: "", degree: "" }],
  certifications: [{ name: "", institute: "" }],
};

const ResumeForm = () =>{
  const [form, setForm] = useState(initialForm);
  const { setFormData } = useContext(ResumeContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const setEdu = (i, field, value) =>
    setForm((f) => {
      const edu = [...f.education];
      edu[i] = { ...edu[i], [field]: value };
      return { ...f, education: edu };
    });

  const setCert = (i, field, value) =>
    setForm((f) => {
      const certs = [...f.certifications];
      certs[i] = { ...certs[i], [field]: value };
      return { ...f, certifications: certs };
    });

  const addEdu = () =>
    setForm((f) => ({ ...f, education: [...f.education, { school: "", from: "", to: "", degree: "" }] }));

  const removeEdu = (i) =>
    setForm((f) => ({ ...f, education: f.education.filter((_, idx) => idx !== i) }));

  const addCert = () =>
    setForm((f) => ({ ...f, certifications: [...f.certifications, { name: "", institute: "" }] }));

  const removeCert = (i) =>
    setForm((f) => ({ ...f, certifications: f.certifications.filter((_, idx) => idx !== i) }));

  const isEducationValid = form.education.some(
    (e) => e.school.trim() && e.degree.trim() && e.from.trim() && e.to.trim()
  );
  const canAddEducation = form.education.some(
    (e) => e.school || e.degree || e.from || e.to
  );
  const canAddCertification = form.certifications.some(
    (c) => c.name || c.institute
  );

  const isValid = form.title.trim() && form.email.trim() && form.phone.trim() && isEducationValid;
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!isValid){
      alert("Please complete required fields & Add at least one education entry!")
      return;
    }
    setLoading(true);
    setFormData(form);
    setLoading(false);
    localStorage.setItem("canAccessATS", "true");
    navigate("/reviewATSResume");
    localStorage.removeItem("canAccessATS");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Complete Your Resume</h1>
          <p className="text-slate-400 mt-1 text-sm">Add details not available from GitHub to complete your resume.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <section className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">Personal Info</h2>
            <div className="space-y-3">
              <input
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Title / Role  e.g. Senior Frontend Developer"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  className="bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                <input
                  className="bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
                <input
                  className="bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Location  e.g. Karachi, PK"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                />
                <input
                  className="bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="LinkedIn URL"
                  value={form.linkedin}
                  onChange={(e) => set("linkedin", e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">Education</h2>
            <div className="space-y-4">
              {form.education.map((edu, i) => (
                <div key={i} className="bg-slate-700/50 rounded-xl p-4 space-y-3 relative">
                  {form.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEdu(i)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-400 text-lg leading-none"
                    >
                      ×
                    </button>
                  )}
                  <input
                    className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="School / College / University"
                    value={edu.school}
                    onChange={(e) => setEdu(i, "school", e.target.value)}
                  />
                  <input
                    className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Degree  e.g. BS Software Engineering"
                    value={edu.degree}
                    onChange={(e) => setEdu(i, "degree", e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      className="bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="From  e.g. 2019"
                      value={edu.from}
                      onChange={(e) => setEdu(i, "from", e.target.value)}
                    />
                    <input
                      className="bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="To  e.g. 2023"
                      value={edu.to}
                      onChange={(e) => setEdu(i, "to", e.target.value)}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addEdu}
                disabled={!canAddEducation}
                className="w-full py-2.5 rounded-lg border border-dashed border-slate-600 text-slate-400 hover:border-indigo-500 hover:text-indigo-400 text-sm transition-colors"
              >
                + Add Education
              </button>
            </div>
          </section>

          {/* Certifications */}
          <section className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-4">Certifications</h2>
            <div className="space-y-4">
              {form.certifications.map((cert, i) => (
                <div key={i} className="bg-slate-700/50 rounded-xl p-4 space-y-3 relative">
                  {form.certifications.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCert(i)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-400 text-lg leading-none"
                    >
                      ×
                    </button>
                  )}
                  <input
                    className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Certificate Name  e.g. Frontend Development"
                    value={cert.name}
                    onChange={(e) => setCert(i, "name", e.target.value)}
                  />
                  <input
                    className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Institute  e.g. Coursera / Meta"
                    value={cert.institute}
                    onChange={(e) => setCert(i, "institute", e.target.value)}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addCert}
                disabled={!canAddCertification}
                className="w-full py-2.5 rounded-lg border border-dashed border-slate-600 text-slate-400 hover:border-indigo-500 hover:text-indigo-400 text-sm transition-colors"
              >
                + Add Certification
              </button>
            </div>
          </section>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-3.5 rounded-xl text-sm tracking-wide transition-colors
              ${loading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"}
            `}
          >
            {loading ? "Saving..." : "Save Resume"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default ResumeForm;
