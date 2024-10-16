"""
AES Encryption & Decryption Application

This application provides a graphical user interface (GUI) for encrypting and decrypting messages using the AES (Advanced Encryption Standard) algorithm in CBC and GCM modes.
Users can input plaintext messages, which are then encrypted and displayed in base64 format.
The application also allows users to decrypt base64-encoded encrypted messages back to plaintext.

Key Features:
- AES-256 encryption and decryption
- Support for CBC and GCM modes
- User-friendly interface with input and output text areas
- Error handling for empty inputs and encryption/decryption failures

Dependencies:
- cryptography
- tkinter

Author: [Your Name]
Date: [Current Date]
"""


from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
import os
import base64
from tkinter import *
from tkinter import messagebox


class AESEncryptionApp:
    def __init__(self, master):
        self.text_decrypted = Text(font="Roboto 20", bg="lightgray", relief=GROOVE, wrap=WORD, bd=0)
        self.text_decrypt_input = Text(font="Roboto 20", bg="white", relief=GROOVE, wrap=WORD, bd=0)
        self.text_encrypted = Text(font="Roboto 20", bg="lightgray", relief=GROOVE, wrap=WORD, bd=0)
        self.text_input = Text(font="Roboto 20", bg="white", relief=GROOVE, wrap=WORD, bd=0)
        self.master = master
        self.master.geometry("400x680")
        self.master.title("AES Encryption & Decryption")

        self.key = os.urandom(32)  # Generare cheie AES-256 (32 bytes = 256 bits)
        self.ciphertext = None

        # Adăugarea unui meniu derulant pentru modul de operare
        self.mode_var = StringVar(value="CBC")
        self.create_widgets()

    @staticmethod
    def aes_encrypt(key, plaintext, mode):
        # Adăugare padding pentru a se asigura că textul are dimensiunea corectă
        padder = padding.PKCS7(algorithms.AES.block_size).padder()
        padded_data = padder.update(plaintext.encode()) + padder.finalize()

        iv = os.urandom(16)  # Generare vector de inițializare (IV) de 16 bytes

        if mode == "CBC":
            cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        elif mode == "GCM":
            cipher = Cipher(algorithms.AES(key), modes.GCM(iv), backend=default_backend())
        else:
            raise ValueError("Unsupported mode selected.")  # Adăugarea unui mesaj de eroare

        encryptor = cipher.encryptor()
        ciphertext = iv + encryptor.update(padded_data) + encryptor.finalize()  # Concatenare IV și ciphertext
        return base64.b64encode(ciphertext).decode()  # Returnează ciphertext-ul codificat în base64

    @staticmethod
    def aes_decrypt(key, ciphertext, mode):
        # Decodificare din base64
        ciphertext = base64.b64decode(ciphertext)
        iv = ciphertext[:16]  # Extrage IV-ul
        actual_ciphertext = ciphertext[16:]  # Ciphertext-ul efectiv

        if mode == "CBC":
            cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        elif mode == "GCM":
            cipher = Cipher(algorithms.AES(key), modes.GCM(iv), backend=default_backend())
        else:
            raise ValueError("Unsupported mode selected.")  # Adăugarea unui mesaj de eroare

        decryptor = cipher.decryptor()
        padded_plaintext = decryptor.update(actual_ciphertext) + decryptor.finalize()

        # Îndepărtarea padding-ului
        unpadder = padding.PKCS7(algorithms.AES.block_size).unpadder()
        plaintext = unpadder.update(padded_plaintext) + unpadder.finalize()
        return plaintext.decode()

    def encrypt_message(self):
        message = self.text_input.get(1.0, END).strip()
        if not message:
            messagebox.showwarning("Warning", "Please enter a message to encrypt!")
            return
        mode = self.mode_var.get()  # Obține modul selectat
        try:
            self.ciphertext = self.aes_encrypt(self.key, message, mode)
            self.text_encrypted.delete(1.0, END)
            self.text_encrypted.insert(END, self.ciphertext)
        except Exception as e:
            messagebox.showerror("Error", f"Encryption failed: {e}")

    def decrypt_message(self):
        encrypted_message = self.text_decrypt_input.get(1.0, END).strip()
        if not encrypted_message:
            messagebox.showwarning("Warning", "Please enter a message to decrypt!")
            return
        mode = self.mode_var.get()  # Obține modul selectat
        try:
            decrypted_message = self.aes_decrypt(self.key, encrypted_message, mode)
            self.text_decrypted.delete(1.0, END)
            self.text_decrypted.insert(END, decrypted_message)
        except Exception as e:
            messagebox.showerror("Error", f"Decryption failed: {e}")

    def reset(self):
        self.text_input.delete(1.0, END)
        self.text_encrypted.delete(1.0, END)
        self.text_decrypted.delete(1.0, END)
        self.text_decrypt_input.delete(1.0, END)

    def exit_program(self):
        self.master.destroy()

    def create_widgets(self):
        Label(text="Enter string here:", fg="black", font=("ARIAL", 12)).place(x=10, y=10)

        # Input message field
        self.text_input.place(x=10, y=40, width=380, height=100)

        # Encrypted message field
        Label(text="Encrypted message (base64):", fg="black", font=("ARIAL", 12)).place(x=10, y=150)
        self.text_encrypted.place(x=10, y=180, width=380, height=80)

        # Input for decryption
        Label(text="Enter encrypted message to decrypt (base64):", fg="black", font=("ARIAL", 12)).place(x=10, y=270)
        self.text_decrypt_input.place(x=10, y=300, width=380, height=100)

        # Decrypted message field
        Label(text="Decrypted message:", fg="black", font=("ARIAL", 12)).place(x=10, y=410)
        self.text_decrypted.place(x=10, y=440, width=380, height=80)

        # Dropdown for mode selection
        Label(text="Select mode:", fg="black", font=("ARIAL", 12)).place(x=10, y=530)
        mode_menu = OptionMenu(self.master, self.mode_var, "CBC", "GCM")
        mode_menu.place(x=10, y=560, width=180)

        # Buttons
        Button(text="ENCRYPT", height="2", width="18", bg="#ed3833", fg="white", bd=0,
               command=self.encrypt_message).place(x=200, y=530)
        Button(text="DECRYPT", height="2", width="18", bg="#00bd56", fg="white", bd=0,
               command=self.decrypt_message).place(x=200, y=570)
        Button(text="RESET", height="2", width="18", bg="#1089ff", fg="white", bd=0,
               command=self.reset).place(x=10, y=610)
        Button(text="EXIT", height="2", width="18", bg="#ff5733", fg="white", bd=0,
               command=self.exit_program).place(x=200, y=610)


if __name__ == "__main__":
    root = Tk()
    app = AESEncryptionApp(root)
    root.mainloop()
