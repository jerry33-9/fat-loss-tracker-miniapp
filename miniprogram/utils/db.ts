/** 云数据库操作封装 */

const db = wx.cloud.database()
const _ = db.command

export const weightCollection = db.collection('weights')
export const dietCollection = db.collection('diets')
export const exerciseCollection = db.collection('exercises')
export const goalCollection = db.collection('goals')

/** 查询某日记录 */
export async function getByDate<T>(
  collection: wx.DB.Collection,
  date: string
): Promise<T[]> {
  const res = await collection
    .where({ date })
    .orderBy('createdAt', 'desc')
    .get()
  return res.data as T[]
}

/** 查询日期范围内的记录 */
export async function getByDateRange<T>(
  collection: wx.DB.Collection,
  startDate: string,
  endDate: string
): Promise<T[]> {
  const res = await collection
    .where({
      date: _.gte(startDate).and(_.lte(endDate))
    })
    .orderBy('date', 'asc')
    .get()
  return res.data as T[]
}

/** 添加记录 */
export async function addRecord<T>(
  collection: wx.DB.Collection,
  data: Omit<T, '_id' | '_openid'>
): Promise<string> {
  const res = await collection.add({ data })
  return res._id
}

/** 更新记录 */
export async function updateRecord<T>(
  collection: wx.DB.Collection,
  id: string,
  data: Partial<T>
): Promise<void> {
  await collection.doc(id).update({ data })
}

/** 删除记录 */
export async function deleteRecord(
  collection: wx.DB.Collection,
  id: string
): Promise<void> {
  await collection.doc(id).remove()
}
