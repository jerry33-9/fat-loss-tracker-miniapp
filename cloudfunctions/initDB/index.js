const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async () => {
  const db = cloud.database()

  // 创建集合（如果不存在）
  const collections = ['weights', 'diets', 'exercises', 'goals']
  for (const name of collections) {
    try {
      await db.createCollection(name)
      console.log(`集合 ${name} 创建成功`)
    } catch (e) {
      if (e.errCode === -502005) {
        console.log(`集合 ${name} 已存在`)
      } else {
        console.error(`创建 ${name} 失败:`, e)
      }
    }
  }

  // 创建索引
  try {
    await db.collection('weights').createIndex({ key: { date: -1 }, name: 'idx_date' })
    await db.collection('diets').createIndex({ key: { date: -1 }, name: 'idx_date' })
    await db.collection('exercises').createIndex({ key: { date: -1 }, name: 'idx_date' })
    console.log('索引创建完成')
  } catch (e) {
    console.error('索引创建失败:', e)
  }

  return { success: true, collections }
}
