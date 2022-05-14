import { execa } from "execa";

export default (bin, ...r) => {
  let args = [];
  let options = {};
  if (r.length > 0) {
    if (typeof r[1] === "object") {
      options = r[1];
    }

    if (Array.isArray(r[0])) {
      args = r[0];
    } else if (typeof r[0] === "object") {
      options = r[0];
    }
  }
  return execa(bin, args, { stdio: "inherit", ...options });
};
