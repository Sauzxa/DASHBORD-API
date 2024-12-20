const bcrypt = require('bcryptjs'); // Make sure to install bcryptjs

module.exports = (sequelize, Sequelize) => {
  const Hauberge = sequelize.define("Hauberge", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: Sequelize.STRING,
      validate: {
        isIn: [['maison', 'camp']], // Constraint for the 'type' column
      },
    },
    capacite: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    nom: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        len: [3, 255], // Enforce name length
      },
    },
    emplacement: {
      type: Sequelize.STRING, // Assuming coordinates in string format
    },
    adresse: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      validate: {
        isEmail: true, // Ensures the email is in valid format
      },
      unique: true, // Enforces email uniqueness
    },
    password: {
      type: Sequelize.STRING,
      set(value) {
        const hashedPassword = bcrypt.hashSync(value, 10); // Hash password before saving
        this.setDataValue('password', hashedPassword);
      },
    },
    telephone: {
      type: Sequelize.STRING,
    },
    nbr_personne_reserve: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    disponibilite: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    image_list: {
      type: Sequelize.JSON, // JSON data type for storing image paths
    },
    offres: {
      type: Sequelize.JSON, // JSON data type for offers
    },
  });

  return Hauberge;
};
