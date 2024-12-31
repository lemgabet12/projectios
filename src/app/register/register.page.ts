import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  userData = {
    nom: '',
    prenom: '',
    role: '',
    cityName: '',
    telephone: '',
    email: '',
    nomdehotel: ''
  };

  roles: any[] = [];
  codCities: any[] = [];
  existingUsers: any[] = [];
  errorMessage: string = '';
  serverUrl: string = '';
  port: string = '';

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private storage: Storage
  ) {}

  async ngOnInit() {
    await this.storage.create();
    this.serverUrl = await this.storage.get('serverUrl') || this.serverUrl;
    this.port = await this.storage.get('port') || this.port;

    await this.fetchRoles();
    await this.fetchCodCities();
    await this.fetchExistingUsers();
  }

  async fetchRoles() {
    const rolesUrl = `${this.serverUrl}:${this.port}/api/insmob/roles`;
    this.http.get<any[]>(rolesUrl).subscribe(
      (response) => {
        this.roles = response;
      },
      (error) => {
        this.errorMessage = 'Erreur de chargement des rôles.';
      }
    );
  }

  async fetchCodCities() {
    const citiesUrl = `${this.serverUrl}:${this.port}/api/insmob/all`;
    this.http.get<any[]>(citiesUrl).subscribe(
      (response) => {
        this.codCities = response;
      },
      (error) => {
        this.errorMessage = 'Erreur de chargement des villes.';
      }
    );
  }

  async fetchExistingUsers() {
    const usersUrl = `${this.serverUrl}:${this.port}/hotel/getlistuser`;
    this.http.get<any[]>(usersUrl).subscribe(
      (response) => {
        this.existingUsers = response;
      },
      (error) => {
        this.errorMessage = 'Erreur de chargement des utilisateurs.';
      }
    );
  }

  ionViewDidEnter() {
    Keyboard.setScroll({ isDisabled: false });
  }

  emailExists(email: string): boolean {
    return this.existingUsers.some(user => user.email === email);
  }

  telephoneExists(telephone: string): boolean {
    return this.existingUsers.some(user => user.telephone === telephone);
  }

  async onSubmit() {
    const combinedTelephone = `${this.userData.cityName}${this.userData.telephone}`;

    if (this.emailExists(this.userData.email)) {
      this.errorMessage = "L'adresse e-mail existe déjà.";
      return;
    }

    if (this.telephoneExists(combinedTelephone)) {
      this.errorMessage = 'Le numéro de téléphone existe déjà.';
      return;
    }

    const submissionData = { ...this.userData, telephone: combinedTelephone };
    const registerUrl = `${this.serverUrl}:${this.port}/api/insmob/register`;

    this.http.post(registerUrl, submissionData).subscribe(
      () => {
        this.navCtrl.navigateRoot('/login');
      },
      (error) => {
        this.errorMessage = "Erreur lors de l'enregistrement.";
      }
    );
  }

  routlogin() {
    this.navCtrl.navigateForward('/login');
  }
}
