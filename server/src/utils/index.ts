export const parseId = (raw: string) => {
  if (!/^\d+$/.test(raw)) throw new Error("invalid id");
  const id = Number(raw);
  if (!Number.isSafeInteger(id)) throw new Error("invalid id");
  return id;
};

export const validCreateNote = (serialNumber: number) => ({
  content: `content${serialNumber}`,
  title: `note${serialNumber}`,
});
