class AttemptsService {

  attempts = [] 
  
  checkAttempts (ipPath: string) {
    if(this.attempts.filter(a => a.ipPath === ipPath).length < 5) {
      return true
    } else {
      return false
    }
  }
  
  addAttempts (ipPath: string) {
    this.attempts.push({ipPath: ipPath, date: Date.now()})
  }
  
  clearAttempts (lagSec = 10) {
    this.attempts = this.attempts.filter(a => a.date + lagSec*1000 >= Date.now())
  }
  
  getAttempts () {
    return this.attempts
  }
  
}
  
export const Attempts = new AttemptsService()