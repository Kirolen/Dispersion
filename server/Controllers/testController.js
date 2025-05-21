const User = require("../Models/User");
const Test = require("../Models/Test");
const Material = require("../Models/Material");
const TestSession = require("../Models/TestSession");
const AssignedUsers = require("../Models/AssignedUsers");

class testController {
  async createTest(req, res) {
    try {
      const { test } = req.body;
      const user = req.user;

      const existUser = await User.findById(user.id);
      if (!existUser) {
        return res.status(404).json({ message: 'Користувача не знайдено' });
      }

      const newTest = new Test({
        ...test,
        createdBy: user.id,
        createdAt: new Date(),
      });

      await newTest.save();

      return res.status(201).json({ message: 'Тест створено успішно', test: newTest });

    } catch (error) {
      console.error('Create test error:', error);
      res.status(500).json({ message: 'Помилка при створенні тесту', error });
    }
  }

  async getTests(req, res) {
    try {
      const tests = await Test.find({}, 'title description questions'); // обмеження полів

      const formatted = tests.map(test => {
        const questionTypeCount = {
          single: 0,
          multiple: 0,
          short: 0,
          long: 0
        };

        test.questions.forEach(q => {
          if (questionTypeCount.hasOwnProperty(q.type)) {
            questionTypeCount[q.type]++;
          }
        });

        return {
          id: test._id,
          title: test.title,
          description: test.description,
          questionCount: test.questions.length,
          questionTypeCount
        };
      });

      return res.json(formatted);
    } catch (error) {
      console.error('Get tests error:', error);
      res.status(500).json({ message: 'Помилка при отриманні тестів', error });
    }
  }

  async getTestById(req, res) {
    try {
      const { id } = req.params;

      const test = await Test.findById(id);
      if (!test) {
        return res.status(404).json({ message: 'Тест не знайдено' });
      }

      return res.json(test);
    } catch (error) {
      console.error('Get test by ID error:', error);
      res.status(500).json({ message: 'Помилка при отриманні тесту', error });
    }
  }

  async updateTest(req, res) {
    try {
      const { id } = req.params;
      const { updatedTest } = req.body;

      const test = await Test.findByIdAndUpdate(id, updatedTest, { new: true });
      if (!test) {
        return res.status(404).json({ message: 'Тест не знайдено' });
      }

      return res.json({ message: 'Тест оновлено успішно', test });
    } catch (error) {
      console.error('Update test error:', error);
      res.status(500).json({ message: 'Помилка при оновленні тесту', error });
    }
  }

  async startTest(req, res) {
    try {
      const { material_id } = req.params;
      const user = req.user
      const material = await Material.findById(material_id).select('test')

      const userTest = await TestSession.findOne({ user: user.id, test: material.test.test, material: material_id })

      return res.json({ message: 'Тест оновлено успішно', test: userTest, testLimit: material.test.testProperties.timeLimit });
    } catch (error) {
      res.status(500).json({ message: 'Помилка при оновленні тесту', error });
    }
  }

  async takeTest(req, res) {
    try {
      const { material_id } = req.params;
      const testAnswers = req.body
      const user = req.user
      const material = await Material.findById(material_id).select('test')

      const userTest = await TestSession.findOne({ user: user.id, test: material.test.test, material: material_id })
      userTest.isCompleted = true
      for (const [key, value] of Object.entries(testAnswers)) {
        const index = parseInt(key, 10);
        if (!isNaN(index) && userTest.questions[index]) {
          userTest.questions[index].userAnswer = value;
        }
      }
      await userTest.save();

      const userAssignment = await AssignedUsers.findOne({ user_id: user.id, material_id: material_id })
      userAssignment.status = "passed_in_time"
      userAssignment.save();

      return res.json({ message: 'Тест здано успішно', success: true });
    } catch (error) {
      res.status(500).json({ message: 'Помилка при оновленні тесту', error });
    }
  }

  async getAttempt(req, res) {
    try {
      const { material_id, student_id } = req.params;

      const student = await User.findById(student_id).select("first_name last_name");
      const material = await Material.findById(material_id).select('test');
      const userTest = await TestSession.findOne({ user: student_id, test: material.test.test, material: material_id });

      const originalQuestionTest = await Test.findById(material.test.test)
        .select('questions._id questions.question questions.options questions.correctAnswers questions.type questions.images questions.qPoints')
        .lean();

      let studentScore = 0;

      if (!userTest.isCheked) {
        userTest.questions = userTest.questions.map(q => {
          const original = originalQuestionTest.questions.find(
            oq => oq._id.equals(q.originalQuestionId)
          );

          if (!original) return q;

          q.scorePerQuestion = 0;
          q.isAutoGraded = true;

          const correct = original.correctAnswers;
          const student = q.userAnswer;
          const fullPoints = original.qPoints ?? 0;

          switch (original.type) {
            case 'single':
              const studentAns = Array.isArray(student) ? student[0] : student;
              const correctAns = Array.isArray(correct) ? correct[0] : correct;
              if (studentAns === correctAns) {
                q.scorePerQuestion = fullPoints;
                studentScore += fullPoints;
              }
              break;

            case 'multiple':
              const correctSet = new Set(correct);
              const studentSet = new Set(student);

              let correctCount = 0;
              let wrongCount = 0;

              studentSet.forEach(ans => {
                if (correctSet.has(ans)) correctCount++;
                else wrongCount++;
              });

              const pointsPerCorrect = fullPoints / correct.length;
              const pointsLostPerWrong = pointsPerCorrect / 2;

              let rawScore = (correctCount * pointsPerCorrect) - (wrongCount * pointsLostPerWrong);
              q.scorePerQuestion = Math.max(0, Math.min(fullPoints, rawScore));
              studentScore += q.scorePerQuestion;
              break;

            case 'short':
            case 'long':
              if (typeof student === 'string') {
                const acceptableAnswers = (correct[0] || '')
                  .toLowerCase()
                  .split(',')
                  .map(s => s.trim());

                if (acceptableAnswers.includes(student.toLowerCase().trim())) {
                  q.scorePerQuestion = fullPoints;
                  studentScore += fullPoints;
                }
              }
              break;
          }

          return q;
        });

        userTest.score = studentScore;
        userTest.isCheked = true;
        await userTest.save();
      }



      const testInfo = {
        studentName: `${student.first_name} ${student.last_name}`,
        score: userTest.score,
        totalPoints: userTest.totalScore,
        questions: userTest.questions.map(q => {
          const original = originalQuestionTest.questions.find(oq => oq._id.equals(q.originalQuestionId));
          return {
            text: original?.question ?? "Unknown question",
            type: original?.type ?? "single",
            options: original?.options ?? [],
            images: original?.images ?? [],
            studentAnswer: q.userAnswer,
            correctAnswer: original?.correctAnswers ?? [],
            points: original?.qPoints ?? 0,
            userScorePerQuestion: q.scorePerQuestion ?? 0,
            isAutoGraded: q.isAutoGraded ?? false
          };
        })
      };

      return res.json({ message: 'Тест перевірено успішно', testInfo });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Помилка при перевірці тесту', error });
    }
  }

  async updateScore(req, res) {
    try {
      const { material_id, student_id } = req.params;
      const newScore = req.body

      const material = await Material.findById(material_id).select('test');
      const userTest = await TestSession.findOne({ user: student_id, test: material.test.test, material: material_id });

      newScore.forEach(ns => {
        if (ns.newScore) {
          userTest.questions[ns.index].scorePerQuestion = ns.newScore
        }
      })
      userTest.score = userTest.questions.reduce((sum, q) => {
        return sum + (q.scorePerQuestion ?? 0);
      }, 0);

      await userTest.save()
      return res.json({ message: 'Тест перевірено успішно', success: true });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Помилка при перевірці тесту', error });
    }
  }


}

module.exports = new testController();
