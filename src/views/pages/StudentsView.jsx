/**
 * Students View - Sectioned layout with detailed student cards
 * Sections: Graduate, Undergraduate, High School, Alumni
 */
import { useStudentController } from '../../controllers/useStudentController.js';
import LinkifiedText from '../components/LinkifiedText.jsx';
import './Page.css';
import './Students.css';

export default function StudentsView() {
  const { data, loading, error } = useStudentController();

  if (loading) return <div className="page-with-banner"><div className="page-content-area"><p>Loading…</p></div></div>;
  if (error) return <div className="page-with-banner"><div className="page-content-area"><p>Error: {error}</p></div></div>;

  const sections = data?.sections ?? [];

  return (
    <div className="page-with-banner">
      <div className="page-banner-wrap">
        <div className="page-banner">
          <h1>Students</h1>
        </div>
      </div>
      <div className="page-content-area">
        {sections
          .filter((sec) => sec.visible !== false)
          .map((sec) => (
            <StudentSection key={sec.id} section={sec} />
          ))}
      </div>
    </div>
  );
}

function StudentSection({ section }) {
  const { label, students = [] } = section;

  return (
    <section className="students-section">
      <h2 className="students-section-heading"><LinkifiedText text={label} keyPrefix={`student-section-${section.id}`} /></h2>
      {students.length === 0 ? (
        <p className="students-empty">No students listed in this section yet.</p>
      ) : (
        students.map((s) => <StudentCard key={s.id} student={s} />)
      )}
    </section>
  );
}

function StudentCard({ student }) {
  const {
    name,
    title,
    department,
    scholarUrl,
    education = [],
    researchInterests = [],
    bio,
    email,
    imageUrl,
    linkedinUrl,
  } = student;

  return (
    <div className="student-card">
      {/* Photo column */}
      <div className="student-photo-col">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="student-photo" />
        ) : (
          <div className="student-photo-placeholder">No Photo</div>
        )}
        <div className="student-social-links">
          {scholarUrl && (
            <a href={scholarUrl} target="_blank" rel="noopener noreferrer">
              🎓 Scholar
            </a>
          )}
          {linkedinUrl && (
            <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
              💼 LinkedIn
            </a>
          )}
        </div>
      </div>

      {/* Details column */}
      <div className="student-details">
        <h3 className="student-name"><LinkifiedText text={name} keyPrefix={`student-name-${student.id}`} /></h3>
        {title && <p className="student-title"><LinkifiedText text={title} keyPrefix={`student-title-${student.id}`} /></p>}
        {department && <p className="student-department"><LinkifiedText text={department} keyPrefix={`student-dept-${student.id}`} /></p>}

        {education.length > 0 && (
          <div className="student-info-block">
            <div className="student-info-label">Education</div>
            <ul>
              {education.map((ed, i) => (
                <li key={i}><LinkifiedText text={ed} keyPrefix={`student-ed-${student.id}-${i}`} /></li>
              ))}
            </ul>
          </div>
        )}

        {researchInterests.length > 0 && (
          <div className="student-info-block">
            <div className="student-info-label">Research Interests</div>
            <ul>
              {researchInterests.map((ri, i) => (
                <li key={i}><LinkifiedText text={ri} keyPrefix={`student-ri-${student.id}-${i}`} /></li>
              ))}
            </ul>
          </div>
        )}

        {bio && (
          <div className="student-info-block">
            <div className="student-info-label">Bio</div>
            <p className="student-bio"><LinkifiedText text={bio} keyPrefix={`student-bio-${student.id}`} /></p>
          </div>
        )}

        {email && (
          <div className="student-info-block">
            <div className="student-info-label">Email</div>
            <a href={`mailto:${email}`} className="student-email">{email}</a>
          </div>
        )}
      </div>
    </div>
  );
}
