import nodemailer from "nodemailer";

export function createTransporter({ host, email, password }) {
  return nodemailer.createTransport({
    host,
    port: 587,
    secure: false,
    auth: {
      user: email,
      pass: password,
    },
  });
}

export function createTransporterForGmail({ host, email, password }) {
  return nodemailer.createTransport({
    service: host,
    auth: {
      user: email,
      pass: password,
    },
  });
}
