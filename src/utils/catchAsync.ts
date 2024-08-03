import { Request, Response, NextFunction } from "express";

/**
 * Return a function that catches and forwards any error a function throws to the next middleware
 *
 * @param {Function} fn - input function that catchAsync wraps around
 * @returns {Function} - function that wraps the input function and handles errors
 */
function catchAsync(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

export default catchAsync;
