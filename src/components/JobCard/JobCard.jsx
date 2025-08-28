import React from "react";
import "./JobCard.css";

export default function JobCard({ job }) {
  return (
    <div className="job-card">
      <div className="job-header">
        <h2>{job.title}</h2>
        <span className="job-type">{job.role_type || "N/A"}</span>
      </div>

      <p className="job-company">{job.company}</p>
      <p className="job-location">{job.location || "Remote"}</p>

      {job.category && <p className="job-category">#{job.category}</p>}

      <div className="job-footer">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="apply-btn"
        >
          Apply
        </a>
      </div>
    </div>
  );
}
