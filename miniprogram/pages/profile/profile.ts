import { calcBMI, bmiCategory } from '../../utils/date'
import { weightCollection, dietCollection, exerciseCollection, goalCollection } from '../../utils/db'

Page({
  data: {
    avatarUrl: '',
    nickName: '',
    hasGoal: false,
    goal: null as UserGoal | null,
    startWeight: '',
    targetWeight: '',
    weeklyIndex: 1,
    weeklyOptions: ['0.3 kg', '0.5 kg', '0.75 kg', '1.0 kg'],
    height: '',
    bmi: 0,
    bmiInfo: { label: '', color: '' },
    currentWeight: 0,
    stats: {
      totalWeights: 0,
      totalDiets: 0,
      totalExercises: 0,
      streakDays: 0
    }
  },

  onShow() {
    this.loadProfile()
  },

  async loadProfile() {
    try {
      const [weightCount, dietCount, exCount, goalRes] = await Promise.all([
        weightCollection.count(),
        dietCollection.count(),
        exerciseCollection.count(),
        goalCollection.limit(1).get()
      ])

      const hasGoal = goalRes.data.length > 0
      const goal = hasGoal ? goalRes.data[0] as UserGoal : null

      // 获取最新体重
      let currentW = 0
      if (hasGoal && goal) {
        const wRes = await weightCollection.orderBy('date', 'desc').limit(1).get()
        if (wRes.data.length > 0) currentW = (wRes.data[0] as WeightRecord).weight
        else currentW = goal.startWeight
      }

      const height = wx.getStorageSync('height') || ''
      let bmi = 0
      let bmiInfo = { label: '', color: '' }
      if (height && currentW > 0) {
        bmi = calcBMI(currentW, Number(height))
        bmiInfo = bmiCategory(bmi)
      }

      this.setData({
        hasGoal,
        goal,
        startWeight: hasGoal ? '' : '',
        targetWeight: hasGoal ? '' : String(goal?.targetWeight || ''),
        currentWeight: currentW,
        height,
        bmi,
        bmiInfo,
        stats: {
          totalWeights: weightCount.total,
          totalDiets: dietCount.total,
          totalExercises: exCount.total,
          streakDays: 0
        }
      })
    } catch (e) {
      console.error(e)
    }
  },

  onStartWeight(e: any) { this.setData({ startWeight: e.detail.value }) },
  onTargetWeight(e: any) { this.setData({ targetWeight: e.detail.value }) },
  onWeeklyChange(e: any) { this.setData({ weeklyIndex: Number(e.detail.value) }) },
  onHeight(e: any) { this.setData({ height: e.detail.value }) },

  saveHeight() {
    wx.setStorageSync('height', this.data.height)
    this.loadProfile()
  },

  async saveGoal() {
    const sw = Number(this.data.startWeight)
    const tw = Number(this.data.targetWeight)
    if (!sw || !tw) {
      wx.showToast({ title: '请填写体重数据', icon: 'none' })
      return
    }
    if (tw >= sw) {
      wx.showToast({ title: '目标体重应小于当前体重', icon: 'none' })
      return
    }

    const weeklyTarget = Number(this.data.weeklyOptions[this.data.weeklyIndex])

    wx.showLoading({ title: '保存中...' })
    try {
      await goalCollection.add({
        data: {
          targetWeight: tw,
          startWeight: sw,
          weeklyTarget,
          startDate: new Date().toISOString().slice(0, 10),
          updatedAt: Date.now()
        }
      })
      wx.showToast({ title: '目标已设定', icon: 'success' })
      this.loadProfile()
    } catch (e) {
      console.error(e)
      wx.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  editGoal() {
    if (this.data.goal) {
      wx.showModal({
        title: '重置目标',
        content: '重置后将清除当前目标数据，确定继续？',
        success: async (res) => {
          if (res.confirm && this.data.goal?._id) {
            try {
              await goalCollection.doc(this.data.goal._id).remove()
              this.setData({ hasGoal: false, goal: null })
            } catch (e) {
              console.error(e)
            }
          }
        }
      })
    }
  }
})
