import MultiVideoPage from '@/components/VideoCall'
import React, { Suspense } from 'react'

function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>

        <MultiVideoPage></MultiVideoPage>
      </Suspense>
    </div>
  )
}

export default page