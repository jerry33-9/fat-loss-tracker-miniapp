import { today, formatDate } from '../../../utils/date'
import { addDiet, uploadFile } from '../../../utils/api'

interface FoodEdit {
  name: string
  amount: string
  calories: number
}

Page({
  data: {
    date: today(),
    dateLabel: '',
    mealType: 'breakfast' as DietRecord['mealType'],
    foods: [
      { name: '', amount: '', calories: 0 }
    ] as FoodEdit[],
    photoUrls: [] as string[],
    note: '',
    totalCalories: 0
  },

  onLoad() {
    const d = today()
    this.setData({ date: d, dateLabel: formatDate(d) })
    const hour = new Date().getHours()
    if (hour < 10) this.setData({ mealType: 'breakfast' })
    else if (hour < 14) this.setData({ mealType: 'lunch' })
    else if (hour < 20) this.setData({ mealType: 'dinner' })
    else this.setData({ mealType: 'snack' })
  },

  onDateChange(e: any) {
    const date = e.detail.value
    this.setData({ date, dateLabel: formatDate(date) })
  },

  setMealType(e: any) {
    this.setData({ mealType: e.currentTarget.dataset.type })
  },

  addFood() {
    const foods = [...this.data.foods, { name: '', amount: '', calories: 0 }]
    this.setData({ foods })
  },

  removeFood(e: any) {
    const index = e.currentTarget.dataset.index
    if (this.data.foods.length <= 1) return
    const foods = this.data.foods.filter((_, i) => i !== index)
    this.setData({ foods }, () => this.calcTotal())
  },

  onFoodChange(e: any) {
    const { index, field } = e.currentTarget.dataset
    const value = field === 'calories' ? Number(e.detail.value) : e.detail.value
    const foods = [...this.data.foods]
    foods[index] = { ...foods[index], [field]: value }
    this.setData({ foods }, () => this.calcTotal())
  },

  calcTotal() {
    const total = this.data.foods.reduce((sum, f) => sum + (f.calories || 0), 0)
    this.setData({ totalCalories: total })
  },

  async takePhoto() {
    try {
      const res = await wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['camera', 'album'],
        sizeType: ['compressed']
      })
      const tempPath = res.tempFiles[0].tempFilePath

      wx.showLoading({ title: '上传中...' })
      const url = await uploadFile(tempPath)

      this.setData({
        photoUrls: [...this.data.photoUrls, url]
      })
    } catch (e) {
      console.error(e)
    } finally {
      wx.hideLoading()
    }
  },

  previewPhoto(e: any) {
    wx.previewImage({
      urls: this.data.photoUrls,
      current: e.currentTarget.dataset.url
    })
  },

  onNoteInput(e: any) {
    this.setData({ note: e.detail.value })
  },

  async save() {
    const validFoods = this.data.foods.filter(f => f.name.trim())
    if (validFoods.length === 0) {
      wx.showToast({ title: '请至少添加一种食物', icon: 'none' })
      return
    }

    wx.showLoading({ title: '保存中...' })
    try {
      await addDiet({
        mealType: this.data.mealType,
        date: this.data.date,
        foods: validFoods.map(f => ({
          name: f.name,
          amount: f.amount,
          calories: f.calories || 0,
        })),
        totalCalories: validFoods.reduce((s, f) => s + (f.calories || 0), 0),
        photoUrls: this.data.photoUrls,
        note: this.data.note
      })
      wx.showToast({ title: '已保存', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 1500)
    } catch (e) {
      console.error(e)
      wx.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  }
})
