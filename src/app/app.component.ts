import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  graphData: any = [];
  hide = false;
  x = new Array();
  y = new Array()
  avg_elv = 0
  max_elv = 0
  isShow:any=''
  max:any=0
  min:any=0
  myChart:any



  constructor(private store: Store<any>, private http: HttpClient) {

    this.http.get('https://elevation.arcgis.com/arcgis/rest/services/Tools/ElevationSync/GPServer/Profile/execute?InputLineFeatures=%7B%22fields%22%3A%5B%7B%22name%22%3A%22OID%22%2C%22type%22%3A%22esriFieldTypeObjectID%22%2C%22alias%22%3A%22OID%22%7D%5D%2C%22geometryType%22%3A%22esriGeometryPolyline%22%2C%22features%22%3A%5B%7B%22geometry%22%3A%7B%22paths%22%3A%5B%5B%5B10.464200935945678%2C45.51541916225363%5D%2C%5B11.021070442780866%2C45.881334972376145%5D%5D%5D%2C%22spatialReference%22%3A%7B%22wkid%22%3A4326%7D%7D%2C%22attributes%22%3A%7B%22OID%22%3A1%7D%7D%5D%2C%22sr%22%3A%7B%22wkid%22%3A4326%7D%7D&ProfileIDField=OID&DEMResolution=90m&MaximumSampleDistance=425.5644849862203&MaximumSampleDistanceUnits=Meters&returnZ=true&returnM=true&f=json')
      .subscribe((posts: any) => {
        this.store.dispatch({ type: "LOADING_GRAPH", payload: posts });
        this.store.subscribe(state => (this.graphData = state.graph.graph));

        if (this.graphData) {
          this.graphData.results.forEach((element: any, i: any) => {
            element.value.features.forEach((element: any) => {
              element.geometry.paths[0].forEach((element: any, i: any) => {
                this.avg_elv += element[2]
                if (element[2] > this.max_elv) {
                  this.max_elv = element[2]
                }
                this.x.push(element[0])
                this.y.push(element[2])
              });
            });
          });
        }
        this.avg_elv=this.avg_elv/this.y.length
        this.getGraphData();
        this.isShow=true

      

      })

  }

  filterData(){
    if(this.min>this.max)return
    this.myChart.destroy();
    this.max_elv=0
    this.avg_elv=0
    let filterdata=new Array()
    this.graphData.results.forEach(( element: any) => {
      element.value.features.forEach((element: any) => {
        element.geometry.paths[0].forEach(( i: any) => {
          if(i[0]>=this.min && i[0]<=this.max){
                    filterdata.push(i[0])

                    this.avg_elv += i[2]
                    if (i[2] > this.max_elv) {
                      this.max_elv = i[2]
                    }
    
          }
        });
      });
    });
   
    this.isShow=true
    
    this.avg_elv=this.avg_elv/this.filterData.length
    // console.log('datasss',filterdata)
    this.myChart = new Chart("myChart", {
      type: 'line',
      data: {
        labels: filterdata,
        datasets: [{
          "label": 'Elevation Dataset',
          "data": this.y,
          borderColor: 'rgb(213, 214, 247)',
          "backgroundColor": 'rgb(10, 17, 242)',
          "yAxisID": 'y',
        }]
      },
      options: {
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
        }
      }
    });
  }

  callMin(event:any){
    this.min=event.value
    // console.log('min calling',event.value)
  }
  callMax(event:any){
    this.max=event.value

    // console.log('max calling',event.value)
  }
  public calElv() {
    this.isShow=true
    this.avg_elv=this.avg_elv/this.y.length
  }

  public getGraphData() {
    this.isShow=false
    Chart.register(...registerables);
     this.myChart = new Chart("myChart", {
      type: 'line',
      data: {
        labels: this.x,
        datasets: [{
          "label": 'Elevation Dataset',
          "data": this.y,
          borderColor: 'rgb(213, 214, 247)',
          "backgroundColor": 'rgb(10, 17, 242)',
          "yAxisID": 'y',
        }]
      },
      options: {
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
        }
      }
    });
  }

  ngOnInit() {

  }

}
