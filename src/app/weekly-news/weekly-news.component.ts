import { Component, OnInit } from '@angular/core';
import { WeeklyNewsService } from '../Services/weekly-news.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-weekly-news',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './weekly-news.component.html',
  styleUrls: ['./weekly-news.component.css']
})
export class WeeklyNewsComponent implements OnInit {
  title: string = 'Weekly News';
  imageUrl: string = '';

  constructor(private weeklyNewsService: WeeklyNewsService) { }

  ngOnInit(): void {
    this.fetchWeeklyNewsImage();
    // Set interval to fetch the latest image every 30 seconds
    setInterval(() => {
      this.fetchWeeklyNewsImage();
    }, 30000);
  }

  // Method to fetch the weekly news image
  fetchWeeklyNewsImage(): void {
    this.weeklyNewsService.getWeeklyNewsImage().subscribe({
      next: (data: any) => {
        console.log(data); // Log the returned data for debugging
        this.imageUrl = data.imageUrl; // Set the image URL
      },
      error: (err) => {
        console.error('Error fetching image', err);
      }
    });
  }
}
