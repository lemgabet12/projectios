import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { Storage } from '@ionic/storage-angular';
import { Keyboard } from '@capacitor/keyboard';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
dismiss() {
throw new Error('Method not implemented.');
}
  emailOrTelephone: string = '';
  password: string = '';
  selectedHotel: string = '';
  rememberMe: boolean = false;
  errorMessage: string = '';
  attempts: number = 0;
  lockedOut: boolean = false;
  countdownMinutes: number = 0;
  countdownSeconds: number = 0;
  lockedOutUntil: Date | null = null;
  passwordVisible: boolean = false;
  passwordFieldType: string = 'password';
  serverUrl: string = 'http://default-url';
  port: string = 'default-port';
  hotels: any[] = [];
  interval: any;
  showHotelSelect: boolean = false;
submitted: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: Storage
  ) {}

  async ngOnInit() {
    this.checkLoginStatus();
    await this.storage.create();
    this.loadConfig();
    this.checkLockoutStatus();
    await this.restoreSavedCredentials();
  //  this.checkInputForHotelDropdown();
  }

  loadConfig() {
    this.serverUrl = localStorage.getItem('serverUrl') || 'http://default-url';
    this.port = localStorage.getItem('port') || 'default-port';
  }
  ionViewDidEnter() {
    Keyboard.setScroll({ isDisabled: false });
  }
  async restoreSavedCredentials() {
    const savedEmail = await this.storage.get('emailOrTelephone');
    const savedPassword = await this.storage.get('password');
    const savedHotel = await this.storage.get('hotel');
    const savedRememberMe = await this.storage.get('rememberMe');

    if (savedRememberMe) {
      this.emailOrTelephone = savedEmail || '';
      this.password = savedPassword || '';
      this.selectedHotel = savedHotel || '';
      this.rememberMe = true;
    }
  }

  
  async handleSuccessfulLogin(userId: string) {
    try {
      const sessionDataResponse: any = await this.http
        .get(`${this.serverUrl}:${this.port}/hotel/GetDataproce`)
        .toPromise();
  
      if (sessionDataResponse && sessionDataResponse.saissionid) {
        const sessionId = sessionDataResponse.saissionid;
  
        localStorage.setItem('userId', userId);
        localStorage.setItem('sessionId', sessionId);
        localStorage.setItem('isLoggedIn', 'true');
  
        if (this.rememberMe) {
          await this.storage.set('emailOrTelephone', this.emailOrTelephone);
          await this.storage.set('password', this.password);
          await this.storage.set('hotel', this.selectedHotel);
          await this.storage.set('rememberMe', true);
        } else {
          await this.storage.remove('emailOrTelephone');
          await this.storage.remove('password');
          await this.storage.remove('hotel');
          await this.storage.remove('rememberMe');
        }
  
        this.navigateToInitialTab(userId);
      } else {
        this.errorMessage = 'Erreur lors de la récupération de l\'ID de session.';
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      this.errorMessage = 'Erreur de connexion au serveur. Veuillez réessayer plus tard.';
    }
  }
  

  checkLockoutStatus() {
    const lockedOutUntilStr = localStorage.getItem('lockedOutUntil');
    if (lockedOutUntilStr) {
      this.lockedOutUntil = new Date(lockedOutUntilStr);
      if (this.lockedOutUntil > new Date()) {
        this.lockedOut = true;
        this.startCountdown();
      } else {
        this.clearLockout();
      }
    }
  }

  checkInputForHotelDropdown() {
    if (this.emailOrTelephone) {
      this.http.get(`${this.serverUrl}:${this.port}/hotel/getlistuser`).subscribe(
        (userResponse: any) => {
          const users = Array.isArray(userResponse) ? userResponse : Object.values(userResponse);
          const user = users.find(
            (u: any) => u.email === this.emailOrTelephone || u.telephone === this.emailOrTelephone
          );

          if (user) {
            this.fetchHotels(user.id);
          } else {
            this.errorMessage = 'Aucun utilisateur trouvé avec cet email/téléphone.';
            this.showHotelSelect = false;
          }
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
    }
  }

  fetchHotels(userId: string) {
    this.http.get(`${this.serverUrl}:${this.port}/hotel/getConfigHotelbyemail/${userId}`).subscribe(
      (response: any) => {
        this.hotels = Array.isArray(response) ? response : Object.values(response);

        if (this.hotels.length > 0) {
          this.showHotelSelect = true;
        } else {
          this.errorMessage = 'Aucun hôtel associé à cet utilisateur.';
          this.showHotelSelect = false;
        }
      },
      (error) => {
        console.error('Error fetching hotels:', error);
        this.errorMessage = 'Erreur de récupération des hôtels.';
        this.showHotelSelect = false;
      }
    );
  }

  onHotelChange() {
    if (this.selectedHotel) {
      this.http.get(`${this.serverUrl}:${this.port}/hotel/getConfigHotel`).subscribe((data: any) => {
        const selectedHotel = data.find(
          (hotel: { name: string }) => hotel.name === this.selectedHotel
        );

        if (selectedHotel) {
          localStorage.setItem('hotelport', selectedHotel.hotelport);
          localStorage.setItem('urlpub', selectedHotel.urlpub);
        }
      });
    }
  }

  async login() {
    // Reset the error message only when the login button is clicked
    this.errorMessage = '';
  
    // Predefined credentials for direct navigation
    if (this.emailOrTelephone === 'sup' && this.password === 'arabsoft123') {
      this.router.navigate(['/config']);
      return;
    }
  
    if (this.lockedOut) {
      this.errorMessage = 'Votre compte est verrouillé. Veuillez patienter avant de réessayer.';
      return;
    }
  
    // Validate required fields
    if (!this.emailOrTelephone || !this.password || !this.selectedHotel) {
      this.errorMessage = 'Tous les champs sont requis.';
      return;
    }
  
    const encryptedPassword = this.encryptPassword(this.password);
  
    try {
      const loginUrl = `${this.serverUrl}:${this.port}/api/usersmob/login`;
      const payload = {
        emailOrTelephone: this.emailOrTelephone,
        password: encryptedPassword,
      };
  
      const response: any = await this.http.post(loginUrl, payload).toPromise();
  
      if (response && response.user) {
        this.handleSuccessfulLogin(response.user);
      } else {
        this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
      }
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      this.errorMessage = 'Erreur de connexion au serveur. Veuillez réessayer plus tard.';
    }
  }
  
  

  encryptPassword(password: string): string {
    return Md5.hashStr(password).toString();
  }
  async checkLoginStatus() {
    // Check for the existence of 'userId' in localStorage
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      // User is logged in, navigate to the main application page
      this.router.navigate(['/menu/home']);
    } else {
      // No userId found, handle the absence (optional)
      console.warn('UserId not found. Redirecting to a fallback route or handling error.');
      // Instead of navigating to login, you can redirect to a fallback page or show a warning.
      this.router.navigate(['/no-access']); // Example fallback route
    }
  }
  


  handleLoginFailure() {
    this.errorMessage = 'Identifiants invalides. Veuillez réessayer.';
    this.attempts++;

    if (this.attempts >= 3) {
      const now = new Date();
      this.lockedOutUntil = new Date(now.getTime() + 10 * 60000);
      localStorage.setItem('lockedOutUntil', this.lockedOutUntil.toISOString());
      this.lockedOut = true;
      this.startCountdown();
    }
  }

  startCountdown() {
    this.interval = setInterval(() => {
      const now = new Date();
      if (this.lockedOutUntil && this.lockedOutUntil > now) {
        const diff = Math.ceil((this.lockedOutUntil.getTime() - now.getTime()) / 1000);
        this.countdownMinutes = Math.floor(diff / 60);
        this.countdownSeconds = diff % 60;
      } else {
        this.clearLockout();
      }
    }, 1000);
  }

  clearLockout() {
    clearInterval(this.interval);
    this.lockedOut = false;
    this.attempts = 0;
    localStorage.removeItem('lockedOutUntil');
    this.lockedOutUntil = null;
  }

  async navigateToInitialTab(userId: string) {
    try {
      const response: any = await this.http.get(`${this.serverUrl}:${this.port}/api/module/user/${userId}`).toPromise();
      const appPages = response.map((item: any) => ({
        name: item.name,
        icon: item.icon,
        url: item.url,
      }));

      const initialTab = appPages.length > 0 ? appPages[0].url : '/menu/home';
      this.router.navigate([initialTab], { queryParams: { id: userId }, replaceUrl: true });
    } catch (error) {
      console.error('Error fetching user data:', error);
      this.errorMessage = 'Error fetching user data. Please try again later.';
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    this.passwordFieldType = this.passwordVisible ? 'text' : 'password';
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}