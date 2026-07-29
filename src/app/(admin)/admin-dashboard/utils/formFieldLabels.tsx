import React from "react";

export function RequiredMark() {
  return (
    <span className="ml-0.5 text-red-500" aria-hidden="true">
      *
    </span>
  );
}

export function OptionalSectionHint() {
  return (
    <p className="text-xs text-gray-500">
      Optional — can be completed now or updated later.
    </p>
  );
}
