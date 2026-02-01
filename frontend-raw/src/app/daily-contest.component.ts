import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Subscription, interval } from 'rxjs';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-daily-contest',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule],
  templateUrl: './daily-contest.component.html',
  styleUrls: ['./daily-contest.component.css']
})
export class DailyContestComponent implements OnInit, OnDestroy {
  public isSupervisor = false;
  public statusActive = false;
  public duration = 60;
  public questions: any[] | null = null;
  public sessionId?: string;
  public answers: any = {};
  public countdown = 0;
  private timerRef: any = null;
  private rolesSub?: Subscription;
  private pollSub?: Subscription;

  // backend base url (adjust if needed)
  private readonly API = 'https://api.cerbon.id/islam.gdansk';

  constructor(private router: Router, private http: HttpClient, private auth: AuthService) {}

  ngOnInit(): void {
    this.rolesSub = this.auth.roles$.subscribe((r) => {
      this.isSupervisor = Array.isArray(r) && r.includes('supervisor');
    });
    // poll status periodically so contesters see when supervisor enables
    this.checkStatus();
    this.pollSub = interval(5000).subscribe(() => this.checkStatus());
  }

  ngOnDestroy(): void {
    try { this.rolesSub?.unsubscribe(); } catch {}
    try { this.pollSub?.unsubscribe(); } catch {}
    this.clearTimer();
  }

  onBack(): void {
    try { this.router.navigate(['/']); } catch { /* ignore */ }
  }

  async checkStatus(): Promise<void> {
    try {
      const resp: any = await this.http.get(this.API + '/daily/status').toPromise();
      this.statusActive = !!resp.active;
      this.duration = resp.duration_seconds || 60;
    } catch (e) {
      this.statusActive = false;
    }
  }

  // Supervisor actions
  public supervisorQuestionsRaw = '[{"text":"Question 1?"},{"text":"Question 2?"}]';

  async startParticipation(): Promise<void> {
    try {
      const questions = JSON.parse(this.supervisorQuestionsRaw);
      const token = this.auth.getToken();
      const headers = token ? new HttpHeaders({ Authorization: 'Bearer ' + token }) : undefined;
      await this.http.post(this.API + '/daily/start', { questions, duration_seconds: 60 }, { headers }).toPromise();
      await this.checkStatus();
      alert('Started');
    } catch (e) {
      alert('Failed to start: ' + String(e));
    }
  }

  async stopParticipation(): Promise<void> {
    try {
      const token = this.auth.getToken();
      const headers = token ? new HttpHeaders({ Authorization: 'Bearer ' + token }) : undefined;
      await this.http.post(this.API + '/daily/stop', {}, { headers }).toPromise();
      await this.checkStatus();
      alert('Stopped');
    } catch (e) {
      alert('Failed to stop: ' + String(e));
    }
  }

  // Contester: fetch and start local countdown
  async fetchQuestions(): Promise<void> {
    try {
      const token = this.auth.getToken();
      const headers = token ? new HttpHeaders({ Authorization: 'Bearer ' + token }) : undefined;
      const resp: any = await this.http.post(this.API + '/daily/fetch', {}, { headers }).toPromise();
      this.questions = Array.isArray(resp.questions) ? resp.questions : [];
      this.duration = resp.duration_seconds || 60;
      this.sessionId = resp.session_id;
      this.answers = {};
      this.startCountdown(this.duration);
    } catch (e) {
      alert('Unable to fetch questions: ' + String(e?.error?.error || e));
    }
  }

  startCountdown(seconds: number): void {
    this.clearTimer();
    this.countdown = seconds;
    this.timerRef = setInterval(() => {
      this.countdown -= 1;
      if (this.countdown <= 0) {
        this.clearTimer();
      }
    }, 1000);
  }

  clearTimer(): void {
    if (this.timerRef) {
      clearInterval(this.timerRef);
      this.timerRef = null;
    }
  }

  async submitAnswers(): Promise<void> {
    if (!this.sessionId) return alert('No active session');
    try {
      const token = this.auth.getToken();
      const headers = token ? new HttpHeaders({ Authorization: 'Bearer ' + token }) : undefined;
      const payload = { session_id: this.sessionId, answers: this.answers };
      const resp: any = await this.http.post(this.API + '/daily/submit', payload, { headers }).toPromise();
      alert('Submitted OK in ' + Math.round(resp.elapsed_seconds || 0) + 's');
      this.clearTimer();
      this.questions = null;
      this.sessionId = undefined;
    } catch (e) {
      alert('Submit failed: ' + String(e?.error?.error || e));
    }
  }
}
