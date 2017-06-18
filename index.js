console.log('\n=======\n');

// Task 1
(() => {
  const calculate = (...args) => {
    return args.reduce((acc, number) => {
      return acc + +('0b' + number);
    }, 0);

    // More old-fashioned way
    // return args
    //   .map((number) => {
    //     return number
    //       .split('')
    //       .reverse()
    //       .reduce((acc, char, index) => {
    //         return (char === '1') ? acc + Math.pow(2, index) : acc;
    //       }, 0);
    //   })
    //   .reduce((acc, number) => acc + number);
  }

  const firstTaskResult = calculate('111', '101', '010', '100', '111', '001');

  console.log(`Binary summ is ${firstTaskResult}`);
})();

console.log('\n=======\n');


// Task 2
// Important note:
// In JS there is a more elegant solution using eval(), but using eval() is bad practice
(() => {
  const NUMBERS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const OPERATORS = {
    plus: '+',
    minus: '-',
    times: '*',
    dividedBy: '/',
  }

  const numbers = {};

  NUMBERS.forEach((name, index) => {
    numbers[name] = (operator) => {
      if (operator) {
        switch(operator.char) {
          case OPERATORS.plus:
            return index + operator.number;
          case OPERATORS.minus:
            return index - operator.number;
          case OPERATORS.times:
            return index * operator.number;
          case OPERATORS.dividedBy:
            return index / operator.number;
        }
      }

      return index;
    };
  });

  const operators = {};

  for (operator in OPERATORS) {
    ((operator) => {
      operators[operator] = (number) => ({ char: OPERATORS[operator], number });
    })(operator);
  }

  const secondTaskResult =
    numbers.seven(
      operators.times(numbers.five()),
    );

  // Elegant solution on Ruby (found in Internet):
  // class Functions
  //   %w[zero one two three four five six seven eight nine].each_with_index do |name, n|
  //     define_method(name) do |args = nil|
  //       args ? n.send(*args) : n.to_f
  //     end
  //   end

  //   %w[plus + minus - times * divided_by /].each_slice(2) do |name, symbol|
  //     define_method(name) do |n|
  //       [symbol, n]
  //     end
  //   end
  // end

  console.log(`7 * 5 = ${secondTaskResult}`);
})();

console.log('\n=======\n');


// Task 3
(() => {
  const add = (a, b) => {
    return a + b;
  }

  const defaultArguments = (func, defaultArgs) => {
    const PARSE_FUNC_REGEXPS = [
      /\(|\)|(\/\/.*$)|(\/\*[\s\S]*?\*\/)/,
      /|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/,
    ];

    const originalArgs =
      func
        .toString()
        .replace(
          new RegExp(
            PARSE_FUNC_REGEXPS.map(regExp => regExp.source),
            'mg',
          ),
          '',
        )
        .split(', ');

    return (...args) => {
      if (args.length < originalArgs.length) {
        return func(
          ...[
            ...args,
            ...originalArgs
              .slice(args.length, originalArgs.length)
              .map((arg) => {
                return defaultArgs[arg];
              })
          ]
        );
      }

      return func(...args);
    };
  }

  const thirdTaskResults =
    [
      defaultArguments(add, { b: 9 })(10),
      defaultArguments(add, { b: 9 })(10, 7),
      defaultArguments(add, { b: 9 })(),
      defaultArguments(add, { b: 3, a: 2 })(10),
      defaultArguments(add, { b: 3, a: 2 })(),
      defaultArguments(add, { c: 3 })(10),
      defaultArguments(add, { c: 3 })(10, 10),
    ];

  console.log(
    'defaultArguments(add, { b: 9 }):',
  );
  console.log(
    `  add(10): ${thirdTaskResults[0]}`,
  );
  console.log(
    `  add(10, 7): ${thirdTaskResults[1]}`,
  );
  console.log(
    `  add(): ${thirdTaskResults[2]}`,
  );

  console.log(
    '\ndefaultArguments(add, { b: 3, a: 2 }):',
  );
  console.log(
    `  add(10): ${thirdTaskResults[3]}`,
  );
  console.log(
    `  add(): ${thirdTaskResults[4]}`,
  );

  console.log(
    '\ndefaultArguments(add, { c: 3 }):',
  );
  console.log(
    `  add(10): ${thirdTaskResults[5]}`,
  );
  console.log(
    `  add(10, 10): ${thirdTaskResults[6]}`,
  );
})();

console.log('\n=======\n');


// Task 4
(() => {
  const SCHEDULES = [
    [['09:00', '11:30'], ['13:30', '16:00'], ['16:00', '17:30'], ['17:45', '19:00']],
    [['09:15', '12:00'], ['14:00', '16:30'], ['17:00', '17:30']],
    [['11:30', '12:15'], ['15:00', '16:30'], ['17:45', '19:00']],
  ];
  // const ARDUOUS_SCHEDULES = [
  //   [['09:00', '10:00'], ['12:00', '14:00']],
  //   [['10:15', '10:30'], ['11:15', '11:30']],
  //   [['17:00', '19:00']],
  //   [['17:00', '17:30'], ['18:00', '18:30']],
  //   [['09:00', '09:15'], ['09:45', '10:00']],
  // ];
  const MINUTES_IN_HOUR = 60;

  const getMinutes = (time) => {
    const timeArr = time.split(':');
    const hours = parseInt(timeArr[0], 10);
    const minutes = parseInt(timeArr[1], 10);

    return hours * MINUTES_IN_HOUR + minutes;
  };

  const leftPad = (number) => number < 10 ? `0${number}` : number;

  const minuteScheduleDummy = new Array(MINUTES_IN_HOUR * 10).fill(true);

  const DAY_START = 9 * MINUTES_IN_HOUR;

  const getAppointmentTime = (duration) => {
    const minuteSchedule = minuteScheduleDummy;

    SCHEDULES.forEach((schedule) => {
      schedule.forEach((busyTime) => {
        const startBusyTime = getMinutes(busyTime[0]) - DAY_START;
        const endBusyTime = getMinutes(busyTime[1]) - DAY_START;
        const busyTimeMinutes = endBusyTime - startBusyTime;

        for (let i = 0; i < busyTimeMinutes; i++) {
          minuteSchedule[startBusyTime + i] = false;
        }
      });
    });

    let freeMinutes = 0;
    let appointmentTime;

    // Use for-in for break
    for (let key in minuteSchedule) {
      minuteSchedule[key] ? freeMinutes++ : freeMinutes = 0;

      if (freeMinutes === duration) {
        const appointmentTimeTotalMinutes = key - duration + DAY_START + 1;
        const appointmentTimeHours =
          leftPad(
            Math.floor(appointmentTimeTotalMinutes / MINUTES_IN_HOUR),
          );
        const appointmentTimeMinutes = leftPad(appointmentTimeTotalMinutes % MINUTES_IN_HOUR);

        appointmentTime = `${appointmentTimeHours}:${appointmentTimeMinutes}`;

        break;
      }
    }

    return appointmentTime;
  }

  console.log(
    `Appoinment time is ${getAppointmentTime(60) || null}`,
  );
})();

console.log('\n=======\n');
