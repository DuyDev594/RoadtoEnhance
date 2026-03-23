export function highlightErrors(text, errors) {
  let result = text;

  errors.forEach((err) => {
    if (!err.original) return;

    const escaped = err.original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // ⚠️ chỉ replace 1 lần để tránh highlight sai
    const regex = new RegExp(escaped);

    result = result.replace(regex, (match) => {
      return `<mark class="bg-red-200 px-1 rounded" title="${err.explanation}">
        ${match}
      </mark>`;
    });
  });

  return result;
}