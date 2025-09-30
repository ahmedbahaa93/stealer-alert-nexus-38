'use client';

import Pagination from "@/components/Pagination";
import MyCertCard from "./MyCertCard";
import { useUserCertificates } from "@/hooks/useUserProfile";

function Certificates() {
  const { data: certificates } = useUserCertificates();

  // Calculate pagination
  const itemsPerPage = 12; // Based on the grid layout (2x4 on desktop, expandable)
  const totalPages = certificates ? Math.ceil(certificates.length / itemsPerPage) : 1;

  return (
    <>
      <MyCertCard />
      {certificates && certificates.length > itemsPerPage && (
        <Pagination
          totalPages={totalPages}
          currentPage={1}
        />
      )}
    </>
  );
}

export default Certificates
