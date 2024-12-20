module.exports = (sequelize, Sequelize) => {
    const Resident = sequelize.define("Resident", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false, // Required field
      },
      prenom: {
        type: Sequelize.STRING,
        allowNull: false, // Required field
      },
      date_naissance: {
        type: Sequelize.DATE,
        allowNull: false, // Required field
      },
      lieu_naissance: {
        type: Sequelize.STRING, // Optional field
      },
      sexe: {
        type: Sequelize.STRING,
        validate: {
          isIn: [['Homme', 'Femme']], // Constraint to allow only 'Homme' or 'Femme'
        },
      },
      numero_carte_identite: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true, // Ensures uniqueness for identification number
      },
      permission_parentale: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Default to false
      },
    });
  
    return Resident;
  };
  