import { calcBMI, bmiCategory } from '../../utils/date'
import { getWeights, getGoal, setGoal, deleteGoal, getStats } from '../../utils/api'

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
    weightLost: '--',
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
      const [goal, stats] = await Promise.all([
        getGoal(),
        getStats()
      ])

      const hasGoal = goal !== null
      let currentW = 0
      if (hasGoal && goal) {
        const weights = await getWeights({ limit: 1 })
        currentW = weights.length > 0 ? weights[0].weight : goal.startWeight
      }

      const height = wx.getStorageSync('height') || ''
      let bmi = 0
      let bmiInfo = { label: '', color: '' }
      if (height && currentW > 0) {
        bmi = calcBMI(currentW, Number(height))
        bmiInfo = bmiCategory(bmi)
      }

      let weightLost = '--'
      if (hasGoal && goal && currentW > 0) {
        weightLost = (goal.startWeight - currentW).toFixed(1)
      }

      this.setData({
        hasGoal,
        goal,
        currentWeight: currentW,
        height,
        bmi,
        bmiInfo,
        weightLost,
        stats: stats || { totalWeights: 0, totalDiets: 0, totalExercises: 0, streakDays: 0 }
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

    wx.showLoading({ title: '保存中...' })
    try {
      await setGoal({
        targetWeight: tw,
        startWeight: sw,
        weeklyTarget: Number(this.data.weeklyOptions[this.data.weeklyIndex])
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
    wx.showModal({
      title: '重置目标',
      content: '重置后将清除当前目标数据，确定继续？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await deleteGoal()
            this.setData({ hasGoal: false, goal: null, weightLost: '--' })
          } catch (e) { console.error(e) }
        }
      }
    })
  }
})
