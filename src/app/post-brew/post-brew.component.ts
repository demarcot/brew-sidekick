import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'post-brew',
  templateUrl: './post-brew.component.html',
  styleUrls: ['./post-brew.component.css']
})
export class PostBrewComponent implements OnInit {

  // Post Brew Calculations
  // - Efficiency
  // - ABV
  public potentialGrav = 1.084;
  public measuredOG = 1.059;
  public measuredFG = 1.060;
  public efficiency: number;
  public abv: number;

  public postBrewFG: FormGroup;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.postBrewFG = new FormGroup({
      potentialGrav: new FormControl(this.potentialGrav),
      measuredOG: new FormControl(this.measuredOG),
      measuredFG: new FormControl(this.measuredFG)
    });

    this.postBrewFG.valueChanges.subscribe(val => {
      this.onChanges();
    });

    this.onChanges();
  }

  public onChanges = (): void => {
    let vals = this.postBrewFG.getRawValue();
    this.measuredOG = vals.measuredOG;
    this.measuredFG = vals.measuredFG;
    this.potentialGrav = vals.potentialGrav;

    this.efficiency = (1.0 - this.measuredOG) / (1.0 - this.potentialGrav);
    this.abv = (this.measuredOG - this.measuredFG) * 131.25;
  };

  public isGT(a: any, b: any): boolean {
    return a > b;
  }

  public isLT(a: any, b: any): boolean {
    return a < b;
  }

  private convertToPts(grav: number) {
    return (grav - 1.0) * 1000;
  }

  private convertToGrav(pts: number) {
    return (pts / 1000.0) + 1.0;
  }
}