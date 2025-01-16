// eslint-disable-next-line no-unused-vars
import React, {useState, useEffect, useCallback} from 'react';
import buildingImage from '../b_zushu.png'
import moveBuildingImage from '../line_zushu.png'
import zufan from '../b_zufan.png'
import zufanOutline from '../line_zufan.png'
import zuchangOutline from '../line_zuchang.png'
import zufonOutline from '../line_zufon.png'
import zugangOutline from '../line_zugang.png'
import zulanOutline from '../line_zulan.png'
import zumiOutline from '../line_zumi.png'
import zushanOutline from '../line_zushan.png'
import zusongOutline from '../line_zusong.png'
import zushuOutline from '../line_zushu.png'
import zutainOutline from '../line_zutain.png'
import zuxingOutline from '../line_zuxing.png'
import zuyinOutline from '../line_zuyin.png'
import zuyangOutline from '../line_zuyuan.png'
import zusuOutline from '../line_zusu.png'
import zuchang from '../b_zuchang.png'
import zufon from '../b_zufon.png'
import zugang from '../b_zugang.png'
import zulan from '../b_zulan.png'
import zumi from '../b_zumi.png'
import zushan from '../b_zushan.png'
import zusong from '../b_zusong.png'
import zushu from '../b_zushu.png'
import zusu from '../b_zusu.png'
import zutain from '../b_zutain.png'
import zuxing from '../b_zuxing.png'
import zuyin from '../b_zuyin.png'
import zuyuang from '../b_zuyuan.png'
import ground from '../樂園.png'

const RandomTimingGame = () => {
    const [isMoving, setIsMoving] = useState(true);
    const [currentImages, setCurrentImages] = useState({
        building: buildingImage,
        moveBuilding: moveBuildingImage,
    });
    const [position, setPosition] = useState({x: 50, y: 50});
    const [targetPos, setTargetPos] = useState({x: 50, y: 50});
    const [score, setScore] = useState(0);
    const [lastMatchTime, setLastMatchTime] = useState(Date.now());
    const [nextMatchDelay, setNextMatchDelay] = useState(2000);
    const [direction, setDirection] = useState({x: 1, y: 1});
    const BOUNDARY_MARGIN = 0;
    const BOUNDARY_MAX = 75;
    const [showSpeedModal, setShowSpeedModal] = useState(false);
    const [speed, setSpeed] = useState(1.5);
    const [showRewardEffect, setShowRewardEffect] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [funMode, setFunMode] = useState(false);
    
    // 修改速度選項生成方式
    const speedOptions = Array.from({length: 9}, (_, i) => 1 + i * 0.25);

    const generateNewMatchTime = useCallback(() => {
        const delay = Math.random() * 5000;
        setNextMatchDelay(delay);
        setLastMatchTime(Date.now());
    }, []);

    useEffect(() => {
        const handleKeyPress = (event) => {
            // 檢查是否為空白鍵
            if (event.code === 'Space') {
                event.preventDefault(); // 防止頁面滾動
                if (isMoving) {
                    handleStop(); // 如果正在移動，則停止
                } else {
                    handleReset(); // 如果停止，則重新開始
                }
            }
        };

        // 添加事件監聽器
        window.addEventListener('keydown', handleKeyPress);

        // 清理事件監聽器
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [isMoving, position]); // 依賴於 isMoving 狀態
    const handleImageClick = (img, outline) => {
        setCurrentImages({
            building: img,
            moveBuilding: outline,
        });
        handleReset()
    };
    // eslint-disable-next-line react/prop-types
    const MoveHouse = ({x, y, funMode}) => (
        <g transform={funMode ? 
            `translate(${x-12.5},${y-12.5}) scale(0.1,0.1)` : 
            `translate(${x},${y}) scale(0.1,0.1)`}>
            <image
                href={currentImages.building}
                preserveAspectRatio="xMidYMid meet"
                width={250}
                height={250}
            />
        </g>
    );

    const CustomHouse = ({x, y, funMode}) => (
        <g transform={funMode ? 
            `translate(${x-12.5},${y-12.5}) scale(0.1,0.1)` : 
            `translate(${x},${y}) scale(0.1,0.1)`}>
            <image
                href={currentImages.moveBuilding}
                preserveAspectRatio="xMidYMid meet"
                width={250}
                height={250}
            />
        </g>
    );
    useEffect(() => {
        generateNewMatchTime();
        const targetX = BOUNDARY_MARGIN + Math.random() * (BOUNDARY_MAX - BOUNDARY_MARGIN);
        const targetY = BOUNDARY_MARGIN + Math.random() * (BOUNDARY_MAX - BOUNDARY_MARGIN);
        setTargetPos({x: targetX, y: targetY});
        const angle = Math.random() * Math.PI * 2;
        setDirection({
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        });
    }, [speed]);

    useEffect(() => {
        if (funMode) return;
        
        let animationFrame;
        let lastTime = Date.now();
        let matchStarted = false;

        const animate = () => {
            if (isMoving) {
                const currentTime = Date.now();
                const deltaTime = (currentTime - lastTime) / 16;
                lastTime = currentTime;

                const timeSinceLastMatch = currentTime - lastMatchTime;

                setPosition(prev => {
                    let newX, newY;
                    let newDirection = {...direction};

                    if (timeSinceLastMatch > 5000 && !matchStarted) {
                        matchStarted = true;
                        const pathToTarget = calculatePathToTarget(prev, targetPos);
                        newX = prev.x + pathToTarget.x * deltaTime;
                        newY = prev.y + pathToTarget.y * deltaTime;
                    } else if (Math.abs(timeSinceLastMatch - nextMatchDelay) < 300) {
                        matchStarted = true;
                        const pathToTarget = calculatePathToTarget(prev, targetPos);
                        newX = prev.x + pathToTarget.x * deltaTime;
                        newY = prev.y + pathToTarget.y * deltaTime;
                    } else {
                        newX = prev.x + direction.x * deltaTime;
                        newY = prev.y + direction.y * deltaTime;
                    }

                    if (newX <= BOUNDARY_MARGIN) {
                        newX = BOUNDARY_MARGIN + 1;
                        newDirection.x = Math.abs(direction.x);
                        newDirection.y += (Math.random() - 0.5) * 0.5;
                    } else if (newX >= BOUNDARY_MAX) {
                        newX = BOUNDARY_MAX - 1;
                        newDirection.x = -Math.abs(direction.x);
                        newDirection.y += (Math.random() - 0.5) * 0.5;
                    }

                    if (newY <= BOUNDARY_MARGIN) {
                        newY = BOUNDARY_MARGIN + 1;
                        newDirection.y = Math.abs(direction.y);
                        newDirection.x += (Math.random() - 0.5) * 0.5;
                    } else if (newY >= BOUNDARY_MAX) {
                        newY = BOUNDARY_MAX - 1;
                        newDirection.y = -Math.abs(direction.y);
                        newDirection.x += (Math.random() - 0.5) * 0.5;
                    }

                    const magnitude = Math.sqrt(newDirection.x * newDirection.x + newDirection.y * newDirection.y);
                    if (magnitude !== 0) {
                        newDirection.x = (newDirection.x / magnitude) * speed;
                        newDirection.y = (newDirection.y / magnitude) * speed;
                    }

                    if (newDirection.x !== direction.x || newDirection.y !== direction.y) {
                        setDirection(newDirection);
                    }

                    if (matchStarted &&
                        Math.abs(newX - targetPos.x) < 1 &&
                        Math.abs(newY - targetPos.y) < 1) {
                        generateNewMatchTime();
                        matchStarted = false;
                    }

                    return {
                        x: Math.max(BOUNDARY_MARGIN, Math.min(BOUNDARY_MAX, newX)),
                        y: Math.max(BOUNDARY_MARGIN, Math.min(BOUNDARY_MAX, newY))
                    };
                });

                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [isMoving, targetPos, lastMatchTime, nextMatchDelay, direction, speed, funMode]);

    const calculatePathToTarget = (currentPos, targetPos) => {
        const dx = targetPos.x - currentPos.x;
        const dy = targetPos.y - currentPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance === 0) return direction;
        return {
            x: (dx / distance) * speed,
            y: (dy / distance) * speed
        };
    };

    const calculateScore = useCallback((pos) => {
        // 直接計算距離，不需要調整位置
        const distance = Math.sqrt(
            Math.pow(pos.x - targetPos.x, 2) +
            Math.pow(pos.y - targetPos.y, 2)
        );
        
        if (distance > 10) return 60;
        return (100 - Math.round(distance) * 2);
    }, [targetPos]);

    const handleStop = () => {
        setIsMoving(false);
        const newScore = calculateScore(position);
        setScore(newScore);
        
        if (newScore >= 90) {
            setShowRewardEffect(true);
        }
    };

    const handleReset = () => {
        setIsMoving(true);
        // 在歡樂模式下調整初始位置
        if (funMode) {
            setPosition({
                x: Math.max(BOUNDARY_MARGIN + 12.5, Math.min(BOUNDARY_MAX + 12.5, 50)),
                y: Math.max(BOUNDARY_MARGIN + 12.5, Math.min(BOUNDARY_MAX + 12.5, 50))
            });
        } else {
            setPosition({
                x: 50,
                y: 50
            });
        }
        setScore(0);
        
        // 在歡樂模式下調整目標位置的範圍
        const minBoundary = funMode ? BOUNDARY_MARGIN + 12.5 : BOUNDARY_MARGIN;
        const maxBoundary = funMode ? BOUNDARY_MAX + 12.5 : BOUNDARY_MAX;
        const targetX = minBoundary + Math.random() * (maxBoundary - minBoundary);
        const targetY = minBoundary + Math.random() * (maxBoundary - minBoundary);
        setTargetPos({x: targetX, y: targetY});
        
        generateNewMatchTime();
        const angle = Math.random() * Math.PI * 2;
        setDirection({
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        });
    };

    const handleMouseDown = useCallback((e) => {
        if (!funMode) return;
        setIsDragging(true);
        
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // 在歡樂模式下調整邊界，右下方增加 12.5
        if (funMode) {
            setPosition({
                x: Math.max(BOUNDARY_MARGIN + 12.5, Math.min(BOUNDARY_MAX + 12.5, x)),
                y: Math.max(BOUNDARY_MARGIN + 12.5, Math.min(BOUNDARY_MAX + 12.5, y))
            });
        } else {
            setPosition({
                x: Math.max(BOUNDARY_MARGIN, Math.min(BOUNDARY_MAX, x)),
                y: Math.max(BOUNDARY_MARGIN, Math.min(BOUNDARY_MAX, y))
            });
        }
    }, [funMode]);

    const handleMouseMove = useCallback((e) => {
        if (!funMode || !isDragging) return;
        
        const svg = e.currentTarget;
        const rect = svg.getBoundingClientRect();
        
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        // 在歡樂模式下調整邊界，右下方增加 12.5
        if (funMode) {
            setPosition({
                x: Math.max(BOUNDARY_MARGIN + 12.5, Math.min(BOUNDARY_MAX + 12.5, x)),
                y: Math.max(BOUNDARY_MARGIN + 12.5, Math.min(BOUNDARY_MAX + 12.5, y))
            });
        } else {
            setPosition({
                x: Math.max(BOUNDARY_MARGIN, Math.min(BOUNDARY_MAX, x)),
                y: Math.max(BOUNDARY_MARGIN, Math.min(BOUNDARY_MAX, y))
            });
        }
    }, [funMode, isDragging]);

    const handleMouseUp = useCallback(() => {
        if (!isDragging) return;
        setIsDragging(false);
        
        // 計算分數
        const newScore = calculateScore(position);
        setScore(newScore);
        
        // 檢查是否達到特效條件
        if (newScore >= 90) {
            setShowRewardEffect(true);
        }
    }, [isDragging, position, calculateScore]);

    return (
        <div className="flex w-screen h-screen ">
            <div className="bg-amber-400 p-5 flex-shrink-0  flex-1">
                <div className="grid grid-cols-2  gap-10 auto-rows-min">
                    <div
                        className=" bg-gray-200 flex flex-col items-center justify-center hover:cursor-pointer hover:scale-105 rounded-lg"
                        onClick={() => handleImageClick(zushan, zushanOutline)}>
                        <img src={zushan} alt="Example 1"
                             className="w-32 h-32  rounded-lg object-contain flex-shrink-0"/>
                        <span className="text-center font-bold text-2xl">築山</span>
                    </div>

                    <div
                        className=" bg-gray-200 flex flex-col items-center justify-center hover:cursor-pointer hover:scale-105 rounded-lg"
                        onClick={() => handleImageClick(zushu, zushuOutline)}
                    >
                        <img src={zushu} alt="Example 1" className="w-32 h-32  object-contain rounded-lg"/>
                        <span className="text-center font-bold text-2xl">築水</span>
                    </div>
                    <div
                        className=" bg-gray-200 flex flex-col items-center justify-center hover:cursor-pointer hover:scale-105 rounded-lg"
                        onClick={() => handleImageClick(zusong, zusongOutline)}
                    >
                        <img src={zusong} alt="Example 1" className="w-32 h-32  object-contain rounded-lg"/>
                        <span className="text-center font-bold text-2xl">築松</span>
                    </div>
                    <div
                        className=" bg-gray-200 flex flex-col items-center justify-center hover:cursor-pointer hover:scale-105 rounded-lg"
                        onClick={() => handleImageClick(zusu, zusuOutline)}
                    >
                        <img src={zusu} alt="Example 1" className="w-32 h-32  object-contain rounded-lg"/>
                        <span className="text-center font-bold text-2xl">築樹</span>
                    </div>
                    <div
                        className=" bg-gray-200 flex flex-col items-center justify-center hover:cursor-pointer hover:scale-105 rounded-lg"
                        onClick={() => handleImageClick(zutain, zutainOutline)}>
                        <img src={zutain} alt="Example 1" className="w-32 h-32  object-contain rounded-lg"/>
                        <span className="text-center font-bold text-2xl">築田</span>
                    </div>
                    <div
                        className=" bg-gray-200 flex flex-col items-center justify-center hover:cursor-pointer hover:scale-105 rounded-lg"
                        onClick={() => handleImageClick(zuxing, zuxingOutline)}
                    >
                        <img src={zuxing} alt="Example 1" className="w-32 h-32  object-contain rounded-lg"/>
                        <span className="text-center font-bold text-2xl">築星</span>
                    </div>
                    <div
                        className=" bg-gray-200 flex flex-col items-center justify-center hover:cursor-pointer hover:scale-105 rounded-lg "
                        onClick={() => handleImageClick(zuyin, zuyinOutline)}
                    >
                        <img src={zuyin} alt="Example 1" className="w-32 h-32  object-contain rounded-lg"/>
                        <span className="text-center font-bold text-2xl">築櫻</span>
                    </div>
                    <div
                        className=" bg-gray-200 flex flex-col items-center justify-center hover:cursor-pointer hover:scale-105 rounded-lg"
                        onClick={() => handleImageClick(zuyuang, zuyangOutline)}
                    >
                        <img src={zuyuang} alt="Example 1" className="w-32 h-32  object-contain rounded-lg"/>
                        <span className="text-center font-bold text-2xl">築院</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 p-4 text-center basis-auto">
                <div className="mb-4 text-6xl">
                    建築快手
                    <p className="text-xl m-2">目前分數: {score}</p>
                </div>

                <div className="relative w-[540px] h-[540px] mx-auto mb-4 border-2 border-gray-300">
                    <svg 
                        className="absolute inset-0 w-full h-full" 
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMid meet"
                        width="540"
                        height="540"
                    >
                        <CustomHouse {...targetPos} funMode={funMode} isTarget={true}/>
                    </svg>

                    <svg 
                        className="absolute inset-0 w-full h-full" 
                        viewBox="0 0 100 100"
                        preserveAspectRatio="xMidYMid meet"
                        width="540"
                        height="540"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        style={{ cursor: funMode ? 'grab' : 'default' }}
                    >
                        <MoveHouse {...position} funMode={funMode} isTarget={false}/>
                    </svg>
                </div>

                <div className="flex justify-center gap-5 w-1/2 mx-auto">
                    <button
                        className="bg-blue-500 text-white px-6 py-4 rounded flex-1"
                        onClick={() => isMoving ? handleStop() : handleReset()}
                    >
                        { '按我'}
                    </button>
                </div>

               
            </div>
            <div className="bg-amber-400 p-5  flex-1">
                <div className="grid grid-cols-2 gap-10">
                    <div
                        className=" bg-gray-200 flex flex-col  items-center justify-center hover:cursor-pointer hover:scale-105 rounded-lg"
                        onClick={() => handleImageClick(zuchang, zuchangOutline)}
                    >
                        <img src={zuchang} alt="Example 1" className="w-32 h-32 object-contain rounded-lg"/>
                        <span className="text-center font-bold text-2xl">築泉</span>
                    </div>
                    <div
                        className=" bg-gray-200 flex flex-col items-center justify-center hover:cursor-pointer hover:scale-105 rounded-lg"
                        onClick={() => handleImageClick(zufan, zufanOutline)}
                    >
                        <img src={zufan} alt="Example 1" className="w-32 h-32 object-contain rounded-lg"/>
                        <span className="text-center font-bold text-2xl">築帆</span>
                    </div>
                    <div
                        className=" bg-gray-200 flex flex-col items-center justify-center hover:cursor-pointer hover:scale-105 rounded-lg "
                        onClick={() => handleImageClick(zufon, zufonOutline)}
                    >
                        <img src={zufon} alt="Example 1" className="w-32 h-32 object-contain rounded-lg "/>
                        <span className="text-center font-bold text-2xl">築楓</span>
                    </div>
                    <div
                        className=" bg-gray-200 flex flex-col items-center justify-center hover:cursor-pointer hover:scale-105 rounded-lg"
                        onClick={() => handleImageClick(zugang, zugangOutline)}
                    >
                        <img src={zugang} alt="Example 1" className="w-32 h-32 object-contain rounded-lg"/>
                        <span className="text-center font-bold text-2xl">築港</span>
                    </div>
                    <div
                        className=" bg-gray-200 flex flex-col items-center justify-center hover:cursor-pointer hover:scale-105 rounded-lg"
                        onClick={() => handleImageClick(zulan, zulanOutline)}
                    >
                        <img src={zulan} alt="Example 1" className="w-32 h-32 object-contain rounded-lg"/>
                        <span className="text-center font-bold text-2xl">築蘭</span>
                    </div>
                    <div
                        className=" bg-gray-200 flex flex-col items-center justify-center hover:cursor-pointer hover:scale-105 rounded-lg"
                        onClick={() => handleImageClick(zumi, zumiOutline)}
                    >
                        <img src={zumi} alt="Example 1" className="w-32 h-32 object-contain rounded-lg"/>
                        <span className="text-center font-bold text-2xl">築米</span>
                    </div>
                    <div
                        className="col-span-2 w-100 h-50 flex flex-col items-center justify-center rounded-lg"
                    >
                        <img 
                            src={ground} 
                            alt="Example 1" 
                            className="w-full h-full object-contain rounded-lg cursor-pointer"
                            onClick={() => setShowSpeedModal(true)}
                        />
                    </div>
                </div>
            </div>

            {/* 添加速度調整Modal */}
            {showSpeedModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg min-w-[200px]">
                        <h3 className="text-xl mb-4 font-bold">調整速度</h3>
                        <select 
                            value={speed}
                            onChange={(e) => setSpeed(parseFloat(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                        >
                            {speedOptions.map(value => (
                                <option key={value} value={value}>
                                    {value.toFixed(2)}倍速
                                </option>
                            ))}
                        </select>
                        
                        {/* 歡樂模式開關 */}
                        <div className="flex items-center gap-2 mb-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={funMode}
                                    onChange={(e) => {
                                        setFunMode(e.target.checked);
                                        if (!e.target.checked) {
                                            // 退出歡樂模式時重置位置
                                            setPosition({x: 50, y: 50});
                                        }
                                    }}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-900">歡樂模式</span>
                            </label>
                        </div>

                        <div className="flex justify-end">
                            <button 
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={() => setShowSpeedModal(false)}
                            >
                                確定
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 修改獎勵特效 */}
            {showRewardEffect && (
                <div 
                    className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn cursor-pointer"
                    onClick={() => {
                        setShowRewardEffect(false);
                        handleReset();
                    }}
                >
                    {/* 星空背景 */}
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-900 via-blue-900 to-black opacity-95">
                        {/* 生成50個隨機位置的星星 */}
                        {Array.from({ length: 50 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 2}s`
                                }}
                            />
                        ))}
                    </div>

                    {/* 中央獎勵文字 */}
                    <div className="relative text-center animate-floatUp">
                        <div className="text-6xl font-bold text-yellow-300 mb-4 animate-pulse">
                            恭喜獲得高分！
                        </div>
                        <div className="text-4xl text-white mb-8 animate-pulse">
                            獲得一顆「星空棒棒糖」
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
};

export default RandomTimingGame;