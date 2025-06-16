import { Link } from "react-router";
import CrumbType from "../../types/crumb-type";
import HomeIcon from "../../assets/icons/home.svg?react";
import breadcrumbStyles from "./Breadcrumb.module.scss";


interface BreadcrumbProps {
  className?: string;
  crumbs: CrumbType[];
}

function Breadcrumb(props: BreadcrumbProps) {
  const breadcrumbClass = `${breadcrumbStyles.breadcrumbContainer} ${props.className || ""}`.trim();

  const redirectToPath = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, path: string) => {
    e.preventDefault();
    window.location.href = path;
  };

  return (
    <nav className={breadcrumbClass}>
      <ol className={breadcrumbStyles.breadcrumbList}>
        {props.crumbs.map((crumb, index) => (
          <li key={index} className={breadcrumbStyles.breadcrumbItem}>
            {index === 0 ? (
              <Link
                className="link"
                to={crumb.path}
                onClick={(e) => redirectToPath(e, crumb.path)}
              >
                <HomeIcon className={breadcrumbStyles.homeIcon} />
              </Link>
            ) : (
              <div className={breadcrumbStyles.crumb}>
                <p className={breadcrumbStyles.slash}>/&nbsp;</p>
                <Link
                  className={breadcrumbStyles.link}
                  to={crumb.path}
                  onClick={(e) => redirectToPath(e, crumb.path)}
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