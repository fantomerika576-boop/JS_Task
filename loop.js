// П8. Свій event loop. Варіант на JavaScript.
//
// Один виконавець, черга задач, черга таймерів. setTimeout лише кладе задачу
// в чергу, а чекає за неї сам цикл.
//


class Loop {
  constructor() {
    this.tasks = [];  // черга готових задач
    this.timers = []; // черга таймерів: об'єкти { dueAt, job }
  }

  // Мілісекунди від старту процесу.
  static now() {
    return Date.now() - Loop.start;
  }
 // задачу в кінець черги задач.
  submit(r) {
    this.tasks.push(r);
  }

  // Покласти таймер у чергу
  setTimeout(delay, r) {
    this.timers.push({ dueAt: Loop.now() + delay, job: r });
  }

  // Зняти й повернути наступну готову задачу, або null.
  poll() {
    //  черга задач має пріоритет
    if (this.tasks.length > 0) {
      return this.tasks.shift();
    }

    //  інакше шукаємо таймер із найменшим dueAt
    if (this.timers.length > 0) {
      let minIdx = 0;
      for (let i = 1; i < this.timers.length; i++) {
        if (this.timers[i].dueAt < this.timers[minIdx].dueAt) minIdx = i;
      }
      // беремо його лише якщо його час уже настав
      if (this.timers[minIdx].dueAt <= Loop.now()) {
        return this.timers.splice(minIdx, 1)[0].job;
      }
    }

    return null;
  }

  run() {
    while (true) {
      const job = this.poll();

      if (job !== null) {
        job();
      } else if (this.timers.length > 0) {
        let minDue = this.timers[0].dueAt;
        for (const t of this.timers) {
          if (t.dueAt < minDue) minDue = t.dueAt;
        }
        while (Loop.now() < minDue) {}
      } else {
        return;
      }
    }
  }
}

Loop.start = Date.now();

module.exports = Loop;
