const fs = require("fs").promises;
const path = require("path");

const contactsPath = path.resolve("./models/contacts.json");

const saveContacts = async (contacts) => {
  try {
    const convertedToJSON = JSON.stringify(contacts);
    await fs.writeFile(contactsPath, convertedToJSON);
  } catch (err) {
    console.log(err);
  }
};

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath);
    return JSON.parse(contacts);
  } catch (err) {
    console.log(err);
  }
};

const getContactById = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contact = contacts.find((contact) => contact.id === contactId);
    return contact;
  } catch (error) {
    console.log(error);
  }
};

const removeContact = async (contactId) => {
  try {
    const contacts = await listContacts();
    const contactsRemove = contacts.filter(
      (contact) => contact.id !== contactId
    );
    await saveContacts(contactsRemove);
  } catch (error) {
    console.log(error);
  }
};

const addContact = async (name, email, phone) => {
  try {
    const contacts = await listContacts();
    const contact = { id: Date.now().toString(), name, email, phone };
    contacts.push(contact);
    await saveContacts(contacts);
  } catch (error) {
    console.log(error);
  }
};

const updateContact = async (contactId, body) => {
  try {
    const contacts = await listContacts();
    const updateContactI = await contacts.findIndex(
      (contact) => contact.id === contactId
    );
    const updatingContact = contacts[updateContactI];
    if (body.name) updatingContact.name = body.name;
    if (body.email) updatingContact.email = body.email;
    if (body.phone) updatingContact.phone = body.phone;

    await saveContacts(contacts);
    return updatingContact;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
