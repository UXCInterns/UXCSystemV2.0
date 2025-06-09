import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DefaultModal from "../../../../../delete/ModalExample/DefaultModal";
import FormInModal from "../../../../../delete/ModalExample/FormInModal";
import FullScreenModal from "../../../../../delete/ModalExample/FullScreenModal";
import ModalBasedAlerts from "../../../../../delete/ModalExample/ModalBasedAlerts";
import VerticallyCenteredModal from "../../../../../delete/ModalExample/VerticallyCenteredModal";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next.js Modals | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Modals page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function Modals() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Modals" />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-6">
        <DefaultModal />
        <VerticallyCenteredModal />
        <FormInModal />
        <FullScreenModal />
        <ModalBasedAlerts />
      </div>
    </div>
  );
}
