import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'corrections',
  templateUrl: './corrections.component.html',
  styleUrls: ['./corrections.component.css']
})
export class CorrectionsComponent implements OnInit {

  // Brew Corrections
  // - Raise Pre Boil Grav
  public collectedPreboilVol = 6.0;
  public measuredGrav = 1.045;
  public targetGrav = 1.065;
  // Weight of addition = (Volume of wort * (Target gravity – Measured gravity)) / Extract potential points of addition
  // Light DME Potential Extract: 1.045
  public dmeAdd: number;

  public correctionsFG: FormGroup;


  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.correctionsFG = new FormGroup({
      collectedPreboilVol: new FormControl(this.collectedPreboilVol),
      measuredGrav: new FormControl(this.measuredGrav),
      targetGrav: new FormControl(this.targetGrav),
    });

    this.correctionsFG.valueChanges.subscribe(val => {
      this.onChanges();
    });

    this.onChanges();
  }

  public onChanges = (): void => {
    let vals = this.correctionsFG.getRawValue();
    this.collectedPreboilVol = vals.collectedPreboilVol;
    this.targetGrav = vals.targetGrav;
    this.measuredGrav = vals.measuredGrav;

    // Weight of addition = (Volume of wort * (Target gravity – Measured gravity)) / Extract potential points of addition
    this.dmeAdd = (this.collectedPreboilVol * (this.convertToPts(this.targetGrav) - this.convertToPts(this.measuredGrav))) / 45;
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