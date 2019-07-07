module.exports = {
    async upsertTag({ tags, park_id, flag, TagCount, addOrUpdate }) {
        if (!tags) return
        tags = tags.split(';').map(v => v.replace(/(^\(|\)$)/g, ''))
        await Promise.all(
            tags.map(async tagName => {
                let instance = await TagCount.findOne({
                    where: {
                        isValid: 1,
                        tagName,
                        park_id,
                        flag
                    }
                })
                if (addOrUpdate === 1) {
                    if (!instance) {
                        await TagCount.create({
                            tagName,
                            park_id,
                            flag,
                            count: 1
                        })
                    } else {
                        instance.count++
                        await instance.save()
                    }
                } else if (addOrUpdate === 0) {
                    if (instance) {
                        if (instance.count >= 1) {
                            instance.count--
                            await instance.save()
                        }
                    }
                }
            })
        )
    }
}
