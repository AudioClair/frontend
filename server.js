// src/assets/db/server.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 3000;

const RESERVATIONS_FILE = path.join(__dirname, "reservations.json");
const CONTACTS_FILE = path.join(__dirname, "contacts.json");

app.use(express.json());
app.use(cors());

if (!fs.existsSync(RESERVATIONS_FILE)) {
  fs.writeFileSync(RESERVATIONS_FILE, "[]", "utf8");
  console.log("Fichier reservations.json créé.");
}

if (!fs.existsSync(CONTACTS_FILE)) {
  fs.writeFileSync(CONTACTS_FILE, "[]", "utf8");
  console.log("Fichier contacts.json créé.");
}

// Routes pour les réservations
app.get("/reservations", (req, res) => {
  console.log("Requête GET reçue sur /reservations");
  fs.readFile(RESERVATIONS_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur de lecture :", err);
      res.status(500).send("Erreur serveur");
      return;
    }
    res.json(JSON.parse(data || "[]"));
  });
});

app.post("/reservations", (req, res) => {
  console.log("Requête POST reçue sur /reservations", req.body);
  const newReservation = req.body;

  fs.readFile(RESERVATIONS_FILE, "utf8", (err, data) => {
    let reservations = [];
    if (!err && data) {
      reservations = JSON.parse(data);
    }
    const maxId =
      reservations.length > 0 ? Math.max(...reservations.map((r) => r.id)) : 0;
    newReservation.id = maxId + 1;
    newReservation.vuOrNot = false;
    reservations.push(newReservation);

    fs.writeFile(
      RESERVATIONS_FILE,
      JSON.stringify(reservations, null, 2),
      (err) => {
        if (err) {
          console.error("Erreur d’écriture :", err);
          res.status(500).send("Erreur lors de l’écriture");
          return;
        }
        res.json({
          message: "Réservation ajoutée avec succès !",
          data: reservations,
        });
      }
    );
  });
});

app.put("/reservations/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`Requête PUT reçue sur /reservations/${id}`, req.body);

  fs.readFile(RESERVATIONS_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur de lecture :", err);
      res.status(500).send("Erreur serveur");
      return;
    }
    let reservations = JSON.parse(data || "[]");
    const index = reservations.findIndex((r) => r.id === id);
    if (index === -1) {
      res.status(404).send("Réservation non trouvée");
      return;
    }
    reservations[index] = { ...reservations[index], ...req.body };

    fs.writeFile(
      RESERVATIONS_FILE,
      JSON.stringify(reservations, null, 2),
      (err) => {
        if (err) {
          console.error("Erreur d’écriture :", err);
          res.status(500).send("Erreur lors de l’écriture");
          return;
        }
        res.json({
          message: "Réservation mise à jour avec succès !",
          data: reservations,
        });
      }
    );
  });
});

app.delete("/reservations/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`Requête DELETE reçue sur /reservations/${id}`);

  fs.readFile(RESERVATIONS_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur de lecture :", err);
      res.status(500).send("Erreur serveur");
      return;
    }
    let reservations = JSON.parse(data || "[]");
    const updatedReservations = reservations.filter((r) => r.id !== id);

    if (reservations.length === updatedReservations.length) {
      res.status(404).send("Réservation non trouvée");
      return;
    }

    fs.writeFile(
      RESERVATIONS_FILE,
      JSON.stringify(updatedReservations, null, 2),
      (err) => {
        if (err) {
          console.error("Erreur d’écriture :", err);
          res.status(500).send("Erreur lors de l’écriture");
          return;
        }
        res.json({
          message: "Réservation supprimée avec succès !",
          data: updatedReservations,
        });
      }
    );
  });
});

// Routes pour les contacts
app.get("/contacts", (req, res) => {
  console.log("Requête GET reçue sur /contacts");
  fs.readFile(CONTACTS_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur de lecture :", err);
      res.status(500).send("Erreur serveur");
      return;
    }
    res.json(JSON.parse(data || "[]"));
  });
});

app.post("/contacts", (req, res) => {
  console.log("Requête POST reçue sur /contacts", req.body);
  const newContact = req.body;

  fs.readFile(CONTACTS_FILE, "utf8", (err, data) => {
    let contacts = [];
    if (!err && data) {
      contacts = JSON.parse(data);
    }
    const maxId =
      contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) : 0;
    newContact.id = maxId + 1;
    newContact.vuOrNot = false;
    contacts.push(newContact);

    fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2), (err) => {
      if (err) {
        console.error("Erreur d’écriture :", err);
        res.status(500).send("Erreur lors de l’écriture");
        return;
      }
      res.json({
        message: "Message de contact ajouté avec succès !",
        data: contacts,
      });
    });
  });
});

app.put("/contacts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`Requête PUT reçue sur /contacts/${id}`, req.body);

  fs.readFile(CONTACTS_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur de lecture :", err);
      res.status(500).send("Erreur serveur");
      return;
    }
    let contacts = JSON.parse(data || "[]");
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1) {
      res.status(404).send("Contact non trouvé");
      return;
    }
    contacts[index] = { ...contacts[index], ...req.body };

    fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2), (err) => {
      if (err) {
        console.error("Erreur d’écriture :", err);
        res.status(500).send("Erreur lors de l’écriture");
        return;
      }
      res.json({ message: "Contact mis à jour avec succès !", data: contacts });
    });
  });
});

app.delete("/contacts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(`Requête DELETE reçue sur /contacts/${id}`);

  fs.readFile(CONTACTS_FILE, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur de lecture :", err);
      res.status(500).send("Erreur serveur");
      return;
    }
    let contacts = JSON.parse(data || "[]");
    const updatedContacts = contacts.filter((c) => c.id !== id);

    if (contacts.length === updatedContacts.length) {
      res.status(404).send("Contact non trouvé");
      return;
    }

    fs.writeFile(
      CONTACTS_FILE,
      JSON.stringify(updatedContacts, null, 2),
      (err) => {
        if (err) {
          console.error("Erreur d’écriture :", err);
          res.status(500).send("Erreur lors de l’écriture");
          return;
        }
        res.json({
          message: "Contact supprimé avec succès !",
          data: updatedContacts,
        });
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});
