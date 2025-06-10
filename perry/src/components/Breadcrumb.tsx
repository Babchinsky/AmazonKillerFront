import { Link } from "react-router";
import CrumbType from "../types/crumb-type";
import Home from "../assets/icons/home.svg?react";
import "./Breadcrumb.scss";


interface BreadcrumbProps {
  className?: string;
  crumbs: CrumbType[];
}

function Breadcrumb(props: BreadcrumbProps) {
  const breadcrumbClass = `breadcrumb-container ${props.className || ""}`.trim();

  const clickLink = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => {
    e.preventDefault();
    window.location.href = path;
  };

  return (
    <nav className={breadcrumbClass}>
      <ol className="breadcrumb-list">
        {props.crumbs.map((crumb, index) => (
          <li key={index} className="breadcrumb-item">
            {index === 0 ? (
              <Link
                className="link"
                to={crumb.path}
                onClick={(e) => clickLink(e, crumb.path)}
              >
                <Home className="home-icon" />
              </Link>
            ) : (
              <div className="crumb">
                <p className="slash">/&nbsp;</p>
                <Link
                  className="link"
                  to={crumb.path}
                  onClick={(e) => clickLink(e, crumb.path)}
                >
                  {crumb.name}
                </Link>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumb;