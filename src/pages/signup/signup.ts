import { FirebaseAuthState } from 'angularfire2';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthService } from './../../providers/auth.service';
import { HomePage } from './../home/home';
import { UserService } from './../../providers/user.service';


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class Signup {
  signupForm: FormGroup;

  constructor(

    public alertCtrl: AlertController,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public userService: UserService
  ) {
    let emailRegex = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', Validators.compose([Validators.required, Validators.pattern(emailRegex)])],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  onSubmit(): void {

    let loading: Loading = this.showLoading();
    let formUser = this.signupForm.value;
    let username: string = formUser.username;

    this.userService.userExist(username)
      .first()
      .subscribe((userExists: boolean) => {

        if (!userExists) {
          this.authService.createAuthUser({
            email: formUser.email,
            password: formUser.password
          }).then((authState: FirebaseAuthState) => {

            delete formUser.password;
            let uuid: string = authState.auth.uid;
            

            this.userService.create(formUser,uuid)
              .then(() => {
                console.log('Usuário Cadastrado!');
                this.navCtrl.setRoot(HomePage);
                loading.dismiss();
              }).catch((error: any) => {

                console.log(error);
                loading.dismiss();
                this.showAlert(error);
              });
          }).catch((error: any) => {
            console.log(error);
            loading.dismiss();
            this.showAlert(error);;
          });

        } else {
          this.showAlert(`O username ${username} já está sendo utilizado em outra conta!`);
          loading.dismiss();
        }

      });


  }

  private showLoading(): Loading {

    let loading: Loading = this.loadingCtrl.create({
      content: 'Please wait ...'
    });
    loading.present();

    return loading;

  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['Ok']
    }).present();

  }
}
