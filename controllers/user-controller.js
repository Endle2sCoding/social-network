const { prisma } = require("../prisma/prisma-client");
const bcrypt = require("bcrypt");
const fs = require("fs");
const Jdenticon = require("jdenticon");
const path = require("path");
const jwt = require("jsonwebtoken");
require("dotenv").config();


const UserController = {
  register: async (req, res) => {
    const { email, password, name } = req.body;

    // Проверяем поля на существование
    if (!email || !password || !name) {
      return res.status(400).json({ error: "All dields is required" });
    }

    try {
      // Проверяем, существует ли пользователь с таким emai
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: "User already exist" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const png = Jdenticon.toPng(name, 200);
      const avatarName = `${name}_${Date.now()}.png`;
      const avatarPath = path.join(__dirname, '/../uploads', avatarName);
      fs.writeFileSync(avatarPath, png);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          avatarUrl: `/uploads/${avatarName}`,
        },
      });

      res.json(user);
    } catch (error) {
      console.error("Error in register:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "All fields is required" });
    }
    try {
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        return res.status(400).json({ error: "Incorrect login or password" });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(400).json({ error: "Incorrect login or password" });
      }

      const token = jwt.sign(({ userId: user.id }), process.env.SECRET_KEY);

      res.json({ token });
    } catch (error) {
      console.error("Error in login:", error);
      res.status(500).json({ error: "Internal server error" });

    }
  },

  getUserById: async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          followers: true,
          following: true
        }
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const isFollowing = await prisma.follows.findFirst({
        where: {
          AND: [
            { followerId: userId },
            { followingId: id }
          ]
        }
      });
      res.json({ ...user, isFollowing: Boolean(isFollowing) });
    } catch (error) {
      console.error("Get current error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateUser: async (req, res) => {
    const { id } = req.params;
    const { email, name, dateOfBirth, bio, location } = req.body;
    let filePath;
    if (req.file && req.file.path) {
      filePath = req.file.path;
    }
    if (id !== req.user.userId) {
      {
        return res.status(403).json({ error: "Нет доступа" });
      }
    }
    try {
      if (email) {
        const existingUser = await prisma.user.findFirst({
          where: { email }
        });

        if (existingUser && existingUser.id !== id) {
          return res.status(400).jsom({ error: "Почта уже используется" });
        }
      }

      const user = await prisma.user.update({
        where: { id },
        data: {
          email: email || undefined,
          name: name || undefined,
          avatarUrl: filePath ? `/${filePath}` : undefined,
          dateOfBirth: dateOfBirth || undefined,
          bio: bio || undefined,
          location: location || undefined
        }
      });
      res.json(user);
    } catch (error) {
      console.error("Update user error", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  current: async (req, res) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.userId },
        include: {
          followers: {
            include: {
              follower: true
            }
          },
          following: {
            include: {
              following: true
            }
          }
        }
      });
      if (!user) {
        return res.status(400).json({ error: "Не удалось найти пользователя" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error("Current user error", error);
      res.status(500).json({ error: "Internal server error" });
    }

  },
};

module.exports = UserController;
