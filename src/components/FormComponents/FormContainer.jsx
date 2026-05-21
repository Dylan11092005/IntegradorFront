import React from "react";



export default function FormContainer({
  title = "Formulario",
  onSubmit,
  children,
}) {
  return (
      <form
        onSubmit={onSubmit}
        className="w-11/12 mt-16 mb-10 bg-white border border-[#00897B] rounded-2xl shadow-2xl flex flex-col"
        >

        <div className="rounded-t-2xl bg-[#00897B] w-full">
          <div className="flex items-center justify-center gap-4 py-6">
            <h2 className="text-2xl font-bold text-white text-center">
              {title}
            </h2>
          </div>
        </div>
        <div className="px-10 py-8">{children}</div>
      </form>
   
  );
}