import React from 'react';
import Join from './Join';

export default function TakeQuickStep() {
	return (
		<div className="bg-white">
			<div
				className="p-5 m-auto mt-10"
				style={{
					maxWidth: '1280px'
				}}
			>
				<div className="flex flex-wrap justify-items-auto md:flex-no-wrap">
					<div className="w-full flex items-center">
						<img src="images/quick-step.jpg" />
          </div>
          <div className="w-full">
            <Join />
          </div>
				</div>
			</div>
		</div>
	);
}
