import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'pre-brew',
  templateUrl: './pre-brew.component.html',
  styleUrls: ['./pre-brew.component.css']
})
export class PreBrewComponent implements OnInit {

  // Pre Brew Calculations
  // - Strike Temp
  // - Strike Vol
  // - Abs Vol
  // - First Runnings Vol
  // - Sparge Vol
  // - Est Pre Boil Grav
  // - Pre Boil Vol
  public targetMashTemp = 152.0;
  public grainWeight = 10.0;
  public absRate = 0.125;
  public evapRate = 0.5;
  public mashTunLoss = 0.21;
  public targetOg = 1.060;
  public batchVol = 5.0;

  public mashThickness: number; // .3125gal/lb
  public grainTemp: number;
  public strikeTemp: number; //(.2/(4*mashThickness))(targetMashTemp - grainTemp) + targetMashTemp
  public strikeVol: number; // grainWeight*mashThickness
  public absVol: number; // grainWeight * absRate
  public preboilVol: number; // batchVol + evapRate * boilHrs
  public firstRunningsVol: number; // strikeVol - (absVol + mashTunLoss)
  public spargeVol: number; // preboilVol - firstRunningsVol
  public estPreboilGrav: number; // (targetOg*targetVol)/preboilVol

  public preBrewCalcsFG: FormGroup;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.preBrewCalcsFG = new FormGroup({
      targetOg: new FormControl(this.targetOg),
      batchVol: new FormControl(this.batchVol),
      targetMashTemp: new FormControl(this.targetMashTemp),
      grainWeight: new FormControl(this.grainWeight),
      absRate: new FormControl(this.absRate),
      mashTunLoss: new FormControl(this.mashTunLoss),
      evapRate: new FormControl(this.evapRate),
    });
    this.mashThickness = .3125;
    this.grainTemp = 68;

    this.preBrewCalcsFG.valueChanges.subscribe(val => {
      this.onChanges();
    });

    this.onChanges();
  }

  public onChanges = (): void => {
    let vals = this.preBrewCalcsFG.getRawValue();
    this.targetMashTemp = vals.targetMashTemp;
    this.grainWeight = vals.grainWeight;
    this.batchVol = vals.batchVol;
    this.evapRate = vals.evapRate;
    this.absRate = vals.absRate;
    this.mashTunLoss = vals.mashTunLoss;
    this.targetOg = vals.targetOg;

    this.strikeTemp = (.2 / (4 * this.mashThickness)) * (this.targetMashTemp - this.grainTemp) + this.targetMashTemp;
    this.strikeVol = this.grainWeight * this.mashThickness;
    this.absVol = this.grainWeight * this.absRate;
    this.preboilVol = 0 + this.batchVol + 1 * this.evapRate;
    this.firstRunningsVol = this.strikeVol - (this.absVol + this.mashTunLoss);
    this.spargeVol = this.preboilVol - this.firstRunningsVol;
    let targetSG = this.convertToPts(this.targetOg);
    let preboilSG = (targetSG * this.batchVol) / this.preboilVol;
    this.estPreboilGrav = this.convertToGrav(preboilSG);
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