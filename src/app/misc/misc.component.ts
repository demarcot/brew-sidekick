import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'misc',
  templateUrl: './misc.component.html',
  styleUrls: ['./misc.component.css']
})
export class MiscComponent implements OnInit {

  // Volume Measuring
  // Assuming holding pot and standing on scale
  // 8.32lbs/gal = 1kg/L
  // vol = (currWeight-emptyWeight)/(8.32*specificGrav)
  public currWeight = 12.0;
  public emptyWeight = 3.0;
  public specificGrav = 1.061;
  public currVol: number;

  public miscFG: FormGroup;


  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    this.miscFG = new FormGroup({
      currWeight: new FormControl(this.currWeight),
      emptyWeight: new FormControl(this.emptyWeight),
      specificGrav: new FormControl(this.specificGrav),
    });

    this.miscFG.valueChanges.subscribe(val => {
      this.onChanges();
    });

    this.onChanges();
  }

  public onChanges = (): void => {
    let vals = this.miscFG.getRawValue();
    this.currWeight = vals.currWeight;
    this.emptyWeight = vals.emptyWeight;
    this.specificGrav = vals.specificGrav;

    this.currVol = (this.currWeight - this.emptyWeight) / (8.32 * this.specificGrav);
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