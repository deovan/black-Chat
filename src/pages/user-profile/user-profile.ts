import { UserService } from './../../providers/user.service';
import { User } from './../../models/user.model';
import { AuthService } from './../../providers/auth.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {

  currentUser: User;
  canEdit: boolean = false;
  uploadProgress: number;
  private filePhoto: File;


  constructor(
    public authService: AuthService,
    public navCtrl: NavController,
    public cd: ChangeDetectorRef,
    public navParams: NavParams,
    public userService: UserService
  ) {
  }

  ionViewCanEnter(): Promise<boolean> {
    return this.authService.authenticated;
  }
  ionViewDidLoad() {
    this.userService.currentUser
      .subscribe((user: User) => {
        this.currentUser = user;
      })
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.filePhoto) {

      let uploadTask = this.userService.uploadPhoto(this.filePhoto, this.currentUser.$key);

      uploadTask.on('state_changed', (snapshot) => {

        this.uploadProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        this.cd.detectChanges();

      }, (error: Error) => {
        console.log('erro ', error)
      }, () => {
        this.editUser(uploadTask.snapshot.downloadURL);
      });

    } else {
      this.editUser();
    }
   

  }

  onPhoto(event): void {
    this.filePhoto = event.target.files[0];
  }

  private editUser(photoUrl?: string): void {
    this.userService
      .edit({
        name: this.currentUser.name,
        username: this.currentUser.username,
        photo: photoUrl || this.currentUser.photo || ''
      }).then(() => {
        this.canEdit = false;
        this.filePhoto = undefined;
        this.uploadProgress = 0;
          this.cd.detectChanges();
      });
  }

}
