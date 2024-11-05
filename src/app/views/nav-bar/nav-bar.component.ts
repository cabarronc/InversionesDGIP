import { Component,OnInit,ViewEncapsulation } from '@angular/core';
import { KENDO_ICONS, SVGIcon } from "@progress/kendo-angular-icons";
import { IconsModule } from "@progress/kendo-angular-icons";
import { homeIcon, bellIcon,menuIcon, userIcon} from "@progress/kendo-svg-icons";
import {
  KENDO_NAVIGATION,
  BreadCrumbItem,
  AppBarThemeColor,
} from "@progress/kendo-angular-navigation";
import { KENDO_INDICATORS } from "@progress/kendo-angular-indicators";
import { KENDO_LAYOUT } from "@progress/kendo-angular-layout";
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [KENDO_ICONS,KENDO_NAVIGATION,KENDO_INDICATORS,KENDO_LAYOUT,CommonModule, RouterOutlet, RouterLink, RouterLinkActive,IconsModule],
  templateUrl: './nav-bar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit{

constructor(private route:ActivatedRoute) {

  
}
ngOnInit(): void {
  this.route.paramMap.subscribe(paramMap=>{
    console.log(paramMap);
  }
  )

}

  public hIcon: SVGIcon = homeIcon;
  public items: BreadCrumbItem[] = [
    {
      text: "Home",
      title: "Home",
      svgIcon: this.hIcon,
    },
    {
      text: "Products",
      title: "Products",
    },
    {
      text: "Keyboards",
      title: "Keyboards",
    },
  ];
  public menuIcon: SVGIcon = menuIcon;
  public bellIcon: SVGIcon = bellIcon;
  public userSvg: SVGIcon = userIcon;

  public themeColor: AppBarThemeColor= 
    "light";
}
