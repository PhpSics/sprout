import { Component } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {  
  title = 'Sproutfy Admin';
  changeOfRoutes(){
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
}


