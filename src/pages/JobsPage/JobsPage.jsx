import { useEffect, useState } from "react";
import axios from "axios";
import "./JobsPage.css";
import JobCard from "../../components/JobCard/JobCard";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState({
    title: "",
    company: "",
    location: "",
    sort: "createdAt",
  });

  const fetchJobs = async () => {
    try {
      const params = { ...filters, limit: pageSize, page };
      const res = await axios.get(`${import.meta.env.VITE_LOCAL_SERVER_ADDRESS}/jobs`, { params });
      setJobs(res.data.jobs);
      setTotal(res.data.total);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      toast.error("Failed to fetch jobs");
    }
  };

  const runCrawler = async () => {
    const loadingToast = toast.loading("Crawling jobs, please wait...");
    try {
      const res = await axios.get(`${import.meta.env.VITE_LOCAL_SERVER_ADDRESS}/run-crawler`);
      toast.update(loadingToast, {
        render: res.data.message,
        type: "success",
        isLoading: false,
        autoClose: 4000,
      });
      // refresh jobs list after crawling
      fetchJobs();
    } catch (err) {
      toast.update(loadingToast, {
        render: "Error crawling jobs",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filters]);

  return (
    <div className="jobs-container">
      <h1 className="title">Job Hunter</h1>

      {/* Search + Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search title..."
          value={filters.title}
          onChange={(e) => setFilters({ ...filters, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by company..."
          value={filters.company}
          onChange={(e) => setFilters({ ...filters, company: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by location..."
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
        >
          <option value="createdAt">Newest</option>
          <option value="title">Title</option>
          <option value="company">Company</option>
        </select>
      </div>

      {/* Crawl Button */}
      <div className="crawl-section">
        <button onClick={runCrawler} className="crawl-btn">
          Fetch More Jobs
        </button>
      </div>

      {/* Job Cards */}
      <div className="jobs-list">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {Math.ceil(total / pageSize) || 1}
        </span>
        <button
          onClick={() =>
            setPage((p) =>
              p < Math.ceil(total / pageSize) ? p + 1 : p
            )
          }
          disabled={page >= Math.ceil(total / pageSize)}
        >
          Next
        </button>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Toast Container */}
      <ToastContainer position="bottom-right" />
    </div>
  );
}
