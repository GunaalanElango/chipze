const router = require("express").Router();
// const { Product } = require("../models/product");
// const { Customer } = require("../models/customer");
// const nodemailer = require("nodemailer");
// const smtpTransport = require("nodemailer-smtp-transport");
// const dotenv = require("dotenv");
// const crypto = require("crypto");
// const { Op } = require("sequelize");
// const bcrypt = require("bcryptjs");
// dotenv.config();

// router.get("/login", async (req, res, next) => {
//   res.render("login", {});
// });

// const transport = nodemailer.createTransport(
//   smtpTransport({
//     host: "smtp.gmail.com",
//     secure: false,
//     port: 587,
//     auth: {
//       user: process.env.USER_EMAIL,
//       pass: process.env.USER_PASSWORD,
//     },
//   })
// );

// /**
//  * GET => /auth/register
//  */
// router.get("/register", (req, res, next) => {
//   res.render("register", {});
// });

// /**
//  * POST => /auth/register
//  */
// router.post("/register", async (req, res, next) => {
//   try {
//     const hashPassword = await bcrypt.hash(req.body.password, 12);

//     const createdCustomer = await Customer.create({
//       name: req.body.name,
//       email: req.body.email,
//       password: hashPassword,
//     });

//     req.session.isLoggedIn = true;
//     req.session.customerId = createdCustomer.id;
//     res.redirect("/customer/home");
//   } catch (error) {
//     console.log(error);
//   }
// });

// /**
//  * GET => /auth/login
//  */
// router.get("/login", (req, res, next) => {
//   res.render("login", {});
// });

// /**
//  * POST => /auth/login
//  */
// router.post("/login", async (req, res, next) => {
//   try {
//     const findCustomer = await Customer.findOne({ where: { email: req.body.email } });

//     // if (!findUser) {
//     //   req.flash("error", "no account found with this email");
//     //   return res.redirect("/auth/login");
//     // }

//     const isPasswordEqual = await bcrypt.compare(req.body.password, findCustomer.password);

//     if (isPasswordEqual) {
//       req.session.isLoggedIn = true;
//       req.session.customerId = findCustomer.id;
//       return res.redirect("/customer/home");
//     } else {
//       // req.flash("error", "incorrect password");
//       return res.redirect("/auth/login");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// /**
//  * GET => /auth/logout
//  */
// router.get("/logout", async (req, res, next) => {
//   try {
//     await req.session.destroy();
//     res.redirect("/customer/home");
//   } catch (error) {
//     console.log(error);
//   }
// });

// // /**
// //  * GET => /auth/forgot-password
// //  */
// // router.get("/forgot-password", (req, res, next) => {
// //   res.render("auth/forgot-password", {
// //     pageTitle: "Reset Password Page",
// //     isAuthenticated: req.session.isLoggedIn,
// //     path: "/auth/forgot-password",
// //     errors: [],
// //     oldInput: {},
// //     adminPanel: false,
// //   });
// // });

// // /**
// //  * POST => /auth/forgot-password
// //  */
// // router.post("/forgot-password", postForgotPassword, async (req, res, next) => {
// //   try {
// //     const errors = validationResult(req);

// //     if (!errors.isEmpty()) {
// //       return res.render("auth/forgot-password", {
// //         pageTitle: "Reset Password Page",
// //         isAuthenticated: req.session.isLoggedIn,
// //         path: "/auth/forgot-password",
// //         errors: errors.array(),
// //         adminPanel: false,
// //         oldInput: {
// //           email: req.body.email,
// //         },
// //       });
// //     }

// //     const findUser = await User.findOne({ where: { email: req.body.email } });

// //     const buffer = crypto.randomBytes(32);
// //     const token = buffer.toString("hex");

// //     const date = Math.round((new Date().getTime() + 3600000) / 1000);
// //     await findUser.update({
// //       resetToken: token,
// //       resetTokenExpiration: date,
// //     });
// //     findUser.save();

// //     res.redirect("/auth/forgot-password");

// //     transport.sendMail(
// //       {
// //         from: "'Gunaalan Elango' <elangogunaalan@gmail.com>",
// //         to: `${req.body.email}`,
// //         subject: "password reset link",
// //         html: `
// //           <h1>password reset</h1>
// //           <p>click this <a href="http://localhost:1234/auth/new-password/${token}" target="_blank">link</a> to reset your password</p>
// //         `,
// //       },
// //       (error, info) => {
// //         if (error) {
// //           return console.log(error);
// //         }
// //         console.log(`message sent: ${info.messageId}`);
// //       }
// //     );
// //   } catch (error) {
// //     console.log(error);
// //   }
// // });

// // /**
// //  * GET => /auth/new-password/:token
// //  */
// // router.get("/new-password/:token", async (req, res, next) => {
// //   const findUser = await User.findOne({
// //     where: {
// //       resetToken: req.params.token,
// //       resetTokenExpiration: {
// //         [Op.gt]: Math.round(new Date().getTime() / 1000),
// //       },
// //     },
// //   });

// //   if (!findUser) {
// //     return res.render("auth/invalid-link", {
// //       pageTitle: "link expired",
// //       isAuthenticated: req.session.isLoggedIn,
// //       path: "/auth/link-expired",
// //       adminPanel: false,
// //     });
// //   }

// //   res.render("auth/new-password", {
// //     pageTitle: "New Password Page",
// //     isAuthenticated: req.session.isLoggedIn,
// //     path: "/auth/new-password",
// //     userId: findUser.get("id") || "",
// //     errors: [],
// //     adminPanel: false,
// //   });
// // });

// // router.post("/new-password", postNewPassword, async (req, res, next) => {
// //   try {
// //     const errors = validationResult(req);

// //     if (!errors.isEmpty()) {
// //       return res.render("auth/new-password", {
// //         pageTitle: "New Password Page",
// //         isAuthenticated: req.session.isLoggedIn,
// //         path: "/auth/new-password",
// //         userId: req.body.userId,
// //         errors: errors.array(),
// //         adminPanel: false,
// //       });
// //     }

// //     const hashPassword = await bcrypt.hash(req.body.newPassword, 12);

// //     await User.update(
// //       {
// //         password: hashPassword,
// //         resetToken: null,
// //         resetTokenExpiration: null,
// //       },
// //       { where: { id: req.body.userId } }
// //     );

// //     res.redirect("/auth/login");
// //   } catch (error) {
// //     console.log(error);
// //   }
// // });

module.exports = router;
