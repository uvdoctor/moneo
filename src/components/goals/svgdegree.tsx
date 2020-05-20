import React from 'react'

interface DegreeSVGProps {
	animationStyle: string
}

export default function DegreeSVG({animationStyle} : DegreeSVGProps) {
    return(
        <svg fill="white" viewBox="0 0 398.97 398.97" style={{animation: animationStyle}}>
							<g>
								<g>
									<path d="M225.092,276.586c-7.101,4.355-16.195,6.754-25.607,6.754c-9.412,0-18.506-2.398-25.607-6.754L57.946,205.484
				c0,0-10.464-6.414-10.464,8.116c0,16.5,0,66,0,66c0,0.66,0,3.973,0,5c0,37.402,68.053,77.723,152,77.723s152-40.32,152-77.723
				c0-1.027,0-4.34,0-5c0,0,0-52.502,0-70.003c0-11.663-7.439-5.964-7.439-5.964L225.092,276.586z" />
									<path d="M392.289,148.927c8.908-5.463,8.908-14.403,0-19.867L215.681,40.745c-8.908-5.463-23.485-5.463-32.393,0L6.681,129.06
				c-8.908,5.463-8.908,14.403,0,19.867l176.607,108.315c8.908,5.463,23.485,5.463,32.393,0" />
									<path d="M384.985,309.475c0-29.906,0-119.625,0-119.625s0.083-5.666-3.279-3.795c-2.697,1.501-9.308,5.186-11.637,7.212
				c-2.689,2.337-2.083,7.583-2.083,7.583s0,81.469,0,108.625c0,1.542-1.325,2.278-1.957,2.65
				c-6.105,3.589-10.21,10.214-10.21,17.809c0,11.414,9.252,20.667,20.667,20.667c11.414,0,20.666-9.253,20.666-20.667
				c0-7.624-4.135-14.27-10.279-17.85C386.262,311.728,384.985,311.016,384.985,309.475z" />
								</g>
							</g>
						</svg>
    )
}