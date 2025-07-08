import { Breadcrumb, type IBreadcrumbItem } from "@fluentui/react";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

interface CustomBreadCrumProps {
  items: IBreadcrumbItem[];
}
const CustomBreadCrum: FC<CustomBreadCrumProps> = ({items}) => {
  const navigate = useNavigate();
   
  const processedItems: IBreadcrumbItem[] = items.map(({ href, ...item }) => ({
    ...item,
    onClick:
      item.onClick ??
      (href ? () => navigate(href) : undefined), // only assign if url exists
  }));
  return (
    
      <Breadcrumb
      style={{ fontSize: "10px", borderBottom: "1px solid rgba(0,0,0,0.1)" }}
      items={processedItems}
    />
    
  );
};

export default CustomBreadCrum;
