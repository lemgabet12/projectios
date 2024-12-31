import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, QueryList, ViewChild, ViewChildren, AfterViewInit, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { menuController, createAnimation, MenuI, Animation } from '@ionic/core';
import { IonPopover, Platform, PopoverController } from '@ionic/angular';
import { DrawerScreen } from '../types/drawer';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.page.html',
  styleUrls: ['./drawer.page.scss'],
})
export class DrawerPage implements AfterViewInit, OnInit {
  getsiglehotel: string = '';
  appPages: DrawerScreen[] = [];
  drawerWidth: number = 280;
  rowWidth: number = this.drawerWidth - 64;
  activeTab: string = '';
  isSplitPane = false;
  userId: any;
  userName: string = '';
  prenom: string | undefined;
  nom: string = '';
  serverUrl: string = 'http://default-url';
  port: string = 'default-port';

  @ViewChild('userAvatar', { read: ElementRef }) userAvatarRef?: ElementRef;
  @ViewChild('menuIcon', { read: ElementRef }) menuIconRef?: ElementRef;
  @ViewChildren('drawerItemList', { read: ElementRef }) drawerItemListRef?: QueryList<ElementRef>;
  @ViewChild('topMenuPopover', { static: false }) topMenuPopover!: IonPopover;

  constructor(
    private popoverController: PopoverController,
    private http: HttpClient,
    public platform: Platform,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private elementRef: ElementRef,
  ) {
    this.widthCalculations();
    this.platform.resize.subscribe(() => {
      this.widthCalculations();
      this.initDrawerAnimation();
    });
  }

  async ngOnInit() {
    
    await this.loadConfig();
    this.initializeUser();
    this.listenForHotelChange();
    this.fetchData();
    this.fetchNomPrenom();

  }
  listenForHotelChange() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'hotelport' || event.key === 'urlpub') {
        this.fetchNomPrenom(); // Reload hotel info when hotel info is updated
      }
    });
  }
  // Called when the page is about to enter or is revisited
  ionViewWillEnter() {
    this.initializeUser();  // Refresh user data
  }

  async loadConfig() {
    this.serverUrl = localStorage.getItem('urlpub') || 'http://default-url';
    this.port = localStorage.getItem('hotelport') || 'default-port';
  }

  ngAfterViewInit() {
    this.initDrawerAnimation();
  }

  // Function to initialize user
  async initializeUser() {
    // Fetch the userId from localStorage
    this.userId = localStorage.getItem('userId');
    
    if (this.userId) {
      try {
        // Fetch the first set of data
        this.fetchData();
  
        // Fetch the second set of data (nom and prenom)
        this.fetchNomPrenom();
  
        // Both fetchData and fetchNomPrenom are complete, initialization is done
        console.log('User data and hotel information fetched successfully');
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    } else {
      // If userId is not present, navigate to login
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }
  
  

  fetchNomPrenom() {
    const url = `${this.serverUrl}:${this.port}/hotel/GetDataproce`;
    this.http.get<{ nomhotel: string; getsiglehotel: string }>(url).subscribe(
      (response) => {
        this.nom = response.nomhotel;
        this.getsiglehotel = response.getsiglehotel;
      },
      (error) => {
        console.error('Failed to fetch hotel name:', error);
      }
    );
  }
  
  fetchData() {
    const url = `${this.serverUrl}:${this.port}/api/module/user/${this.userId}`;
    this.http.get<any[]>(url).subscribe(
      (response: any[]) => {
        this.appPages = response.map((item: any) => ({
          name: item.name,
          icon: item.icon,
          url: item.url,
        }));
  
        // Refresh the active tab
        this.activeTab = this.appPages[0]?.name || '';
      },
      (error) => {
        console.error('Failed to fetch data:', error);
      }
    );
  }
  

  canActivate(): boolean {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  logout() {
    // Clear all user session-related data from localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('urlpub');
    localStorage.removeItem('hotelport');
    localStorage.removeItem('selectedTab');  // Remove selectedTab if logging out

    // Navigate to the login page and replace the URL to prevent navigating back
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  widthCalculations() {
    const deviceWidth = this.platform.width();
    this.drawerWidth = deviceWidth * 0.75;
    if (deviceWidth > 992) {
      const splitPaneWidth = (deviceWidth * 28) / 100;
      this.rowWidth = splitPaneWidth - 64;
      this.isSplitPane = true;
    } else {
      this.rowWidth = this.drawerWidth - 64;
      this.isSplitPane = false;
    }
  }

  initDrawerAnimation() {
    const avatarAnim = createAnimation()
      .addElement(this.userAvatarRef?.nativeElement)
      .fromTo('transform', 'rotate(36deg) scale(0.8)', 'rotate(0deg) scale(1)');

    const drawerItems: Animation[] = [];
    const itemRefArray = this.drawerItemListRef?.toArray();
    for (const itemRef of itemRefArray!) {
      const element = itemRef.nativeElement;
      const drawerItemAnim = createAnimation()
        .addElement(element.querySelector('.drawerInnerItem'))
        .fromTo('transform', `translateX(-${this.rowWidth}px)`, 'translateX(0px)');
      drawerItems.push(drawerItemAnim);
    }

    const menuElement = this.menuIconRef?.nativeElement;
    const iconAnim = createAnimation()
      .addElement(menuElement.querySelector('.menu__icon'))
      .fromTo('transform', 'translate(-50%, -50%)', 'rotate(180.01deg) translate(50%, 50%)');

    const line1Anim = createAnimation()
      .addElement(menuElement.querySelector('.menu__line--1'))
      .fromTo('transform', 'translate3d(0px, 0px, 0) rotate(0deg) scaleX(1.0)', 'translate3d(6px, 2px, 0) rotate(45deg) scaleX(0.65)');

    const line3Anim = createAnimation()
      .addElement(menuElement.querySelector('.menu__line--3'))
      .fromTo('transform', 'translate3d(0px, 0px, 0) rotate(0deg) scaleX(1.0)', 'translate3d(6px, -2px, 0) rotate(-45deg) scaleX(0.65)');

    const menuIconAnim = createAnimation()
      .addElement(menuElement)
      .fromTo('transform', 'translateX(0px)', `translateX(${this.drawerWidth}px)`)
      .addAnimation(iconAnim)
      .addAnimation(line1Anim)
      .addAnimation(line3Anim);

    menuController.registerAnimation('my-reveal', (menu: MenuI) => {
      const openedX = menu.width * (menu.isEndSide ? -1 : 1) + 'px';
      const contentOpen = createAnimation()
        .addElement(menu.contentEl!)
        .fromTo('transform', 'translateX(0px)', `translateX(${openedX})`);

      return createAnimation()
        .duration(400)
        .addAnimation(contentOpen)
        .addAnimation(avatarAnim)
        .addAnimation(drawerItems)
        .addAnimation(menuIconAnim);
    });
  }

  onDrawerNavigate(page: DrawerScreen) {
    if (page.url) {
      this.activeTab = page.name;
      localStorage.setItem('selectedTab', page.name);  // Store selected tab in localStorage
    }
  }

  onMenuClick() {
    menuController.toggle('main-menu');
  }

  openTopMenu(event: Event) {
    this.topMenuPopover.event = event;
    this.topMenuPopover.present();
  }

  goToProfile() {
    this.topMenuPopover.dismiss();
    this.router.navigate(['/modif-pass']);
  }

  openModifierPasswordPage() { 
    this.router.navigate(['/settings/change-password']); 
    this.dismissPopover(); 
  }

  openModifierEmailPage() { 
    this.router.navigate(['/settings/change-email']); 
    this.dismissPopover(); 
  }

  async dismissPopover() { 
    if (this.topMenuPopover) { 
      await this.topMenuPopover.dismiss(); 
    } 
  }
}
