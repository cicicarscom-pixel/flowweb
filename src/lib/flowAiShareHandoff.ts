export interface ShareJob {
  caption: string;
  platforms: string[];
  skipped: { platform: string; reason: string }[];
  scheduledLocal: string | null;
  timezone: string;
}

export interface SharePageRegistration {
  ready: boolean;
  share: () => Promise<void>;
}

class FlowAiShareHandoff {
  private file: File | null = null;
  private job: ShareJob | null = null;
  private page: SharePageRegistration | null = null;
  private taken = false;

  attach(file: File) {
    this.file = file;
    this.taken = false;
  }

  clear() {
    this.file = null;
    this.job = null;
    this.taken = false;
  }

  getFile(): File | null {
    return this.file;
  }

  setJob(job: ShareJob) {
    this.job = job;
    this.taken = false;
  }

  takeJob(): ShareJob | null {
    if (this.taken || !this.job) return null;
    this.taken = true;
    return this.job;
  }

  registerPage(page: SharePageRegistration) {
    this.page = page;
  }

  unregisterPage() {
    this.page = null;
  }

  async confirm(): Promise<'NOT_READY' | 'STARTED'> {
    if (!this.page || !this.page.ready) {
      return 'NOT_READY';
    }
    this.page.share(); // Don't await here, it runs in background and signals via window event
    return 'STARTED';
  }
}

export const flowAiShareHandoff = new FlowAiShareHandoff();
